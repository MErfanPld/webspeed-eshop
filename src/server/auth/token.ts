/**
 * Signed session tokens (HMAC-SHA256, Web Crypto).
 * Runs in both the Edge middleware and Node route handlers — no Node APIs.
 *
 * Format: base64url(JSON payload) + "." + base64url(signature)
 */
export const SESSION_COOKIE = "ws_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  /** session id (row in `sessions`, allows revocation) */
  sid: string;
  /** user id */
  uid: string;
  /** expiry, unix seconds */
  exp: number;
};

const DEV_SECRET = "dev-only-insecure-secret-change-me-0123456789abcdef";

export function getAuthSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEV_SECRET !== "1") {
    throw new Error("AUTH_SECRET (≥ 32 chars) must be set in production.");
  }
  return DEV_SECRET;
}

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function signSession(payload: SessionPayload, secret = getAuthSecret()): Promise<string> {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(body));
  return `${body}.${b64url(new Uint8Array(sig))}`;
}

/** Verify signature and expiry. Returns null for any invalid token. */
export async function verifySession(
  token: string | undefined | null,
  secret = getAuthSecret(),
  nowSeconds = Math.floor(Date.now() / 1000)
): Promise<SessionPayload | null> {
  if (!token || token.length > 2048) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromB64url(sig) as BufferSource,
      enc.encode(body)
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as SessionPayload;
    if (typeof payload.sid !== "string" || typeof payload.uid !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp <= nowSeconds) return null;
    return payload;
  } catch {
    return null;
  }
}
