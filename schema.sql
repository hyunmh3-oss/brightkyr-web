-- Bright Kyrgyzstan 자료실 회원 데이터베이스 (Cloudflare D1)
--
-- 넣는 법:
--   wrangler d1 execute brightkyr-members --remote --file=schema.sql
--
-- 수집 항목은 아이디·비밀번호·이름·이메일뿐이다.
-- 생년월일과 연락처는 받지 않기로 했다. 개인정보처리방침도 이에 맞춰져 있다.

CREATE TABLE IF NOT EXISTS members (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,          -- 로그인 아이디 (영문·숫자 4~20자, 소문자로 저장)
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  pw_hash       TEXT NOT NULL,                 -- pbkdf2$반복수$소금$해시 — 평문은 저장하지 않는다
  status        TEXT NOT NULL DEFAULT 'active',-- active | blocked
  created_at    TEXT NOT NULL,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,                 -- 무작위 64자. 쿠키에 담기는 값
  member_id  INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- 누가 무엇을 받아갔는지. 자료가 새어나갔을 때 경로를 찾기 위한 것이다.
CREATE TABLE IF NOT EXISTS downloads (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER,
  key       TEXT NOT NULL,
  at        TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_downloads_at ON downloads(at);

-- 로그인을 여러 번 틀리면 보안문자를 요구하기 위한 기록
CREATE TABLE IF NOT EXISTS login_fails (
  username TEXT PRIMARY KEY,
  count    INTEGER NOT NULL DEFAULT 0,
  last_at  TEXT
);
