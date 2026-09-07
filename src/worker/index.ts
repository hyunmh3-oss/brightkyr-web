/**
 * Bright Kyrgyzstan — 자료실 회원제 Worker
 *
 * 이 사이트는 원래 정적 파일만 내보내는 구조였다.
 * 자료실(러시아어판 `/ru/library`)만 회원 확인이 필요해서 그 앞에만 이 스크립트를 둔다.
 *
 * 나머지 페이지·이미지는 이 스크립트를 거치지 않고 바로 나간다
 * (wrangler.jsonc 의 assets.run_worker_first 참고). 그래서 요금도 들지 않는다.
 *
 * 하는 일
 *   - 가입 / 로그인 / 로그아웃
 *   - `/ru/library/*` 페이지를 로그인한 사람에게만 내보내기
 *   - 첨부 파일을 R2 에서 꺼내 로그인한 사람에게만 내보내기
 *   - 내려받기 기록 남기기
 */

export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  LIBRARY: R2Bucket;
  /** Turnstile 비밀 키 — `wrangler secret put TURNSTILE_SECRET` 로 넣는다 */
  TURNSTILE_SECRET?: string;
}

// ── 설정 ────────────────────────────────────────────────
const COOKIE = 'bk_session';
const SESSION_DAYS = 14;
/**
 * 비밀번호 해시 반복 횟수.
 * Workers 무료 요금제는 요청당 CPU 시간이 짧아서 무한정 올릴 수 없다.
 * 실제로 측정한 뒤 한도 안에서 가장 큰 값으로 맞춘 것이다. (측정: /api/dev/bench)
 */
const PBKDF2_ITERATIONS = 100_000;
/** 로그인 실패가 이 횟수를 넘으면 보안문자를 요구한다 */
const CAPTCHA_AFTER_FAILS = 3;
/**
 * 자료실 경로. 자료는 러시아어뿐이지만 화면 껍데기는 보던 언어를 따라가므로
 * 4개 언어 모두에 자료실이 있다.
 *   /library  /en/library  /ky/library  /ru/library
 */
const LIB_PATH = /^\/(?:(en|ky|ru)\/)?library(?:\/|$)/;

/** 요청 경로에서 자료실 부분을 떼어낸다. 자료실이 아니면 null. */
function libraryPart(path: string): { prefix: string; rest: string } | null {
  const m = LIB_PATH.exec(path);
  if (!m) return null;
  const prefix = m[1] ? `/${m[1]}` : '';
  return { prefix, rest: path.slice(`${prefix}/library`.length) };
}

// ── 도구 ────────────────────────────────────────────────
const enc = new TextEncoder();

function b64(buf: ArrayBuffer): string {
  const b = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s);
}

function randomHex(bytes: number): string {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (x) => x.toString(16).padStart(2, '0')).join('');
}

/** 비밀번호를 PBKDF2-SHA256 으로 해시한다. 저장 형식: `pbkdf2$반복수$소금$해시` */
async function hashPassword(password: string, saltHex?: string, iterations = PBKDF2_ITERATIONS) {
  const salt = saltHex ?? randomHex(16);
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations },
    key,
    256
  );
  return `pbkdf2$${iterations}$${salt}$${b64(bits)}`;
}

/** 저장된 해시와 대조한다. 값이 같은지 볼 때 시간차가 나지 않게 비교한다. */
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[1], 10);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;
  const again = await hashPassword(password, parts[2], iterations);
  const a = enc.encode(again);
  const b = enc.encode(stored);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

function readCookie(request: Request, name: string): string {
  const raw = request.headers.get('Cookie') ?? '';
  const m = raw.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : '';
}

function sessionCookie(token: string, maxAgeSec: number) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSec}`;
}

// ── 회원 ────────────────────────────────────────────────
interface Member {
  id: number;
  username: string;
  name: string;
  email: string;
  status: string;
}

/** 쿠키의 세션을 확인하고 회원을 돌려준다. 없거나 만료면 null. */
async function currentMember(request: Request, env: Env): Promise<Member | null> {
  const token = readCookie(request, COOKIE);
  if (!token) return null;
  const row = await env.DB.prepare(
    `SELECT m.id, m.username, m.name, m.email, m.status
       FROM sessions s JOIN members m ON m.id = s.member_id
      WHERE s.token = ?1 AND s.expires_at > datetime('now')`
  )
    .bind(token)
    .first<Member>();
  if (!row || row.status !== 'active') return null;
  return row;
}

/** Turnstile 로 사람인지 확인한다. 비밀 키가 없으면 검사를 건너뛴다(개발 중). */
async function checkTurnstile(env: Env, token: string, ip: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const j = (await r.json()) as { success?: boolean };
    return j.success === true;
  } catch {
    return false;
  }
}

// ── 처리 ────────────────────────────────────────────────

async function handleJoin(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  let body: Record<string, string>;
  try {
    body = (await request.json()) as Record<string, string>;
  } catch {
    return json({ ok: false, code: 'BAD_REQUEST' }, 400);
  }

  const username = (body.username ?? '').trim().toLowerCase();
  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const password = body.password ?? '';

  if (!username || !name || !email || !password) return json({ ok: false, code: 'REQUIRED' }, 400);
  if (!/^[a-z0-9]{4,20}$/.test(username)) return json({ ok: false, code: 'ID_RULE' }, 400);
  if (password.length < 10) return json({ ok: false, code: 'PW_SHORT' }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ ok: false, code: 'EMAIL_RULE' }, 400);

  if (!(await checkTurnstile(env, body.captcha ?? '', ip))) {
    return json({ ok: false, code: 'CAPTCHA' }, 400);
  }

  const dup = await env.DB.prepare('SELECT 1 FROM members WHERE username = ?1').bind(username).first();
  if (dup) return json({ ok: false, code: 'ID_TAKEN' }, 409);

  const pwHash = await hashPassword(password);
  await env.DB.prepare(
    `INSERT INTO members (username, name, email, pw_hash, status, created_at)
     VALUES (?1, ?2, ?3, ?4, 'active', datetime('now'))`
  )
    .bind(username, name, email, pwHash)
    .run();

  return json({ ok: true });
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  let body: Record<string, string>;
  try {
    body = (await request.json()) as Record<string, string>;
  } catch {
    return json({ ok: false, code: 'BAD_REQUEST' }, 400);
  }

  const username = (body.username ?? '').trim().toLowerCase();
  const password = body.password ?? '';
  if (!username || !password) return json({ ok: false, code: 'REQUIRED' }, 400);

  // 여러 번 틀린 뒤에는 보안문자를 요구한다
  const fails = await env.DB.prepare(
    `SELECT count FROM login_fails WHERE username = ?1 AND last_at > datetime('now','-1 hour')`
  )
    .bind(username)
    .first<{ count: number }>();
  const needCaptcha = (fails?.count ?? 0) >= CAPTCHA_AFTER_FAILS;
  if (needCaptcha && !(await checkTurnstile(env, body.captcha ?? '', ip))) {
    return json({ ok: false, code: 'CAPTCHA', needCaptcha: true }, 400);
  }

  const row = await env.DB.prepare(
    'SELECT id, username, name, email, status, pw_hash FROM members WHERE username = ?1'
  )
    .bind(username)
    .first<Member & { pw_hash: string }>();

  const good = row ? await verifyPassword(password, row.pw_hash) : false;

  if (!good || row!.status !== 'active') {
    await env.DB.prepare(
      `INSERT INTO login_fails (username, count, last_at) VALUES (?1, 1, datetime('now'))
       ON CONFLICT(username) DO UPDATE SET count = count + 1, last_at = datetime('now')`
    )
      .bind(username)
      .run();
    return json({ ok: false, code: 'LOGIN_FAILED', needCaptcha: (fails?.count ?? 0) + 1 >= CAPTCHA_AFTER_FAILS }, 401);
  }

  await env.DB.prepare('DELETE FROM login_fails WHERE username = ?1').bind(username).run();

  const token = randomHex(32);
  await env.DB.prepare(
    `INSERT INTO sessions (token, member_id, created_at, expires_at)
     VALUES (?1, ?2, datetime('now'), datetime('now', ?3))`
  )
    .bind(token, row!.id, `+${SESSION_DAYS} days`)
    .run();
  await env.DB.prepare("UPDATE members SET last_login_at = datetime('now') WHERE id = ?1").bind(row!.id).run();

  return json(
    { ok: true, name: row!.name },
    200,
    { 'Set-Cookie': sessionCookie(token, SESSION_DAYS * 86400) }
  );
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
  const token = readCookie(request, COOKIE);
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token = ?1').bind(token).run();
  return json({ ok: true }, 200, { 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` });
}

/** 화면에서 바로 재생·표시할 수 있는 종류 (내려받지 않고 그대로 보여준다) */
function isPlayable(key: string) {
  return /\.(mp4|webm|m4v|mp3|m4a|ogg|jpg|jpeg|png|gif|webp|pdf)$/i.test(key);
}

/**
 * 첨부 파일을 R2 에서 꺼내 내보낸다. 로그인한 사람만.
 *
 * 영상은 `inline` 으로 내보내고 Range 요청을 지원한다.
 * 그래야 브라우저가 통째로 받지 않고 재생하면서 앞뒤로 넘길 수 있다.
 * `?dl=1` 을 붙이면 재생 대신 내려받기가 된다.
 */
async function handleFile(request: Request, env: Env, key: string): Promise<Response> {
  const me = await currentMember(request, env);
  if (!me) return new Response('Unauthorized', { status: 401 });

  const url = new URL(request.url);
  const forceDownload = url.searchParams.get('dl') === '1';
  const inline = !forceDownload && isPlayable(key);

  // 브라우저가 "이 구간만 달라"고 하면 그 부분만 보낸다 (영상 재생·이동)
  const rangeHeader = request.headers.get('Range');
  let range: R2Range | undefined;
  if (rangeHeader) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
    if (m) {
      const start = m[1] ? parseInt(m[1], 10) : undefined;
      const end = m[2] ? parseInt(m[2], 10) : undefined;
      if (start !== undefined && end !== undefined) range = { offset: start, length: end - start + 1 };
      else if (start !== undefined) range = { offset: start };
      else if (end !== undefined) range = { suffix: end };
    }
  }

  const obj = await env.LIBRARY.get(key, range ? { range, onlyIf: request.headers } : undefined);
  if (!obj) return new Response('Not Found', { status: 404 });
  if (!('body' in obj) || !obj.body) return new Response(null, { status: 304 });

  // 누가 무엇을 받아갔는지 남긴다. 재생 중 이어받기는 한 번만 세도록 첫 구간만 기록한다.
  const firstChunk = !range || (range as { offset?: number }).offset === 0 || (range as { offset?: number }).offset === undefined;
  if (firstChunk) {
    await env.DB.prepare("INSERT INTO downloads (member_id, key, at) VALUES (?1, ?2, datetime('now'))")
      .bind(me.id, key)
      .run();
  }

  const name = url.searchParams.get('name') ?? key.split('/').pop() ?? 'file';
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'private, no-store');
  // 파일 이름에 러시아어·한국어가 들어가므로 RFC 5987 형식으로 함께 적는다
  headers.set(
    'Content-Disposition',
    `${inline ? 'inline' : 'attachment'}; filename="file"; filename*=UTF-8''${encodeURIComponent(name)}`
  );

  if (obj.range && 'offset' in obj.range) {
    const start = obj.range.offset ?? 0;
    const len = obj.range.length ?? obj.size - start;
    headers.set('Content-Range', `bytes ${start}-${start + len - 1}/${obj.size}`);
    headers.set('Content-Length', String(len));
    return new Response(obj.body, { status: 206, headers });
  }

  headers.set('Content-Length', String(obj.size));
  return new Response(obj.body, { headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // ── 회원 API ─────────────────────────────
    if (path === '/api/auth/join' && request.method === 'POST') return handleJoin(request, env);
    if (path === '/api/auth/login' && request.method === 'POST') return handleLogin(request, env);
    if (path === '/api/auth/logout' && request.method === 'POST') return handleLogout(request, env);
    if (path === '/api/auth/me') {
      const me = await currentMember(request, env);
      return json(me ? { ok: true, name: me.name, username: me.username } : { ok: false });
    }

    // ── 자료실 (첨부 파일 · 페이지) ──────────
    const lib = libraryPart(path);
    if (lib) {
      // 첨부 파일: /{언어}/library/file/<키>
      if (lib.rest.startsWith('/file/')) {
        const key = decodeURIComponent(lib.rest.slice('/file/'.length));
        // 다른 곳을 넘겨다보지 못하게 자료실 안으로 제한한다
        if (!key.startsWith('library/') || key.includes('..')) {
          return new Response('Bad Request', { status: 400 });
        }
        return handleFile(request, env, key);
      }

      // 목록·글 보기: 로그인한 사람에게만
      const me = await currentMember(request, env);
      if (!me) {
        // 로그인 화면으로 보내되, 돌아올 곳과 보던 언어를 유지한다
        const back = encodeURIComponent(path + url.search);
        return Response.redirect(`${url.origin}${lib.prefix}/member/login?next=${back}`, 302);
      }
      return env.ASSETS.fetch(request);
    }

    // ── 나머지는 그대로 ──────────────────────
    return env.ASSETS.fetch(request);
  },
};
