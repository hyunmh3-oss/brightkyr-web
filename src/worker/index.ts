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
/** 자료실 페이지 경로 (러시아어판에만 있다) */
const LIB_PREFIX = '/ru/library';

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

/** 첨부 파일을 R2 에서 꺼내 내보낸다. 로그인한 사람만. */
async function handleFile(request: Request, env: Env, key: string): Promise<Response> {
  const me = await currentMember(request, env);
  if (!me) return new Response('Unauthorized', { status: 401 });

  const obj = await env.LIBRARY.get(key);
  if (!obj) return new Response('Not Found', { status: 404 });

  // 누가 무엇을 받아갔는지 남긴다
  await env.DB.prepare('INSERT INTO downloads (member_id, key, at) VALUES (?1, ?2, datetime(\'now\'))')
    .bind(me.id, key)
    .run();

  const name = new URL(request.url).searchParams.get('name') ?? key.split('/').pop() ?? 'file';
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('Content-Length', String(obj.size));
  headers.set('Cache-Control', 'private, no-store');
  // 파일 이름에 러시아어·한국어가 들어가므로 RFC 5987 형식으로 함께 적는다
  headers.set(
    'Content-Disposition',
    `attachment; filename="download"; filename*=UTF-8''${encodeURIComponent(name)}`
  );
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

    // ── 첨부 파일 ────────────────────────────
    if (path.startsWith(`${LIB_PREFIX}/file/`)) {
      const key = decodeURIComponent(path.slice(`${LIB_PREFIX}/file/`.length));
      // 다른 곳을 넘겨다보지 못하게 자료실 안으로 제한한다
      if (!key.startsWith('library/') || key.includes('..')) {
        return new Response('Bad Request', { status: 400 });
      }
      return handleFile(request, env, key);
    }

    // ── 자료실 페이지 ────────────────────────
    if (path === LIB_PREFIX || path.startsWith(`${LIB_PREFIX}/`)) {
      const me = await currentMember(request, env);
      if (!me) {
        // 로그인 화면으로 보내되, 돌아올 곳을 기억해 둔다
        const back = encodeURIComponent(path + url.search);
        return Response.redirect(`${url.origin}/ru/member/login?next=${back}`, 302);
      }
      return env.ASSETS.fetch(request);
    }

    // ── 나머지는 그대로 ──────────────────────
    return env.ASSETS.fetch(request);
  },
};
