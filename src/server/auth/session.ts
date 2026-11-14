import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "../db";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession } from "./token";

export type Role = "owner" | "admin" | "editor";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type StoreMembership = {
  storeId: string;
  storeName: string;
  storeSlug: string;
  role: Role;
};

export async function createSession(userId: string): Promise<{ token: string; expires: Date }> {
  const db = getDb();
  const sid = randomUUID();
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const expires = new Date(exp * 1000);
  const now = new Date().toISOString();
  db.prepare("INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").run(
    sid,
    userId,
    expires.toISOString(),
    now
  );
  // Opportunistic cleanup of expired sessions
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(now);
  return { token: await signSession({ sid, uid: userId, exp }), expires };
}

export function secureCookies(): boolean {
  return process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "1";
}

export async function setSessionCookie(token: string, expires: Date) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookies(),
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const payload = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (payload) getDb().prepare("DELETE FROM sessions WHERE id = ?").run(payload.sid);
  jar.delete(SESSION_COOKIE);
}

/** Current user from the session cookie (signature + DB session row checked) */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const payload = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  const row = getDb()
    .prepare(
      `SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.user_id = ? AND s.expires_at > ?`
    )
    .get(payload.sid, payload.uid, new Date().toISOString()) as AuthUser | undefined;
  return row ? { id: row.id, email: row.email, name: row.name } : null;
}

export function getMemberships(userId: string): StoreMembership[] {
  return getDb()
    .prepare(
      `SELECT m.store_id AS storeId, s.name AS storeName, s.slug AS storeSlug, m.role AS role
       FROM store_members m JOIN stores s ON s.id = m.store_id
       WHERE m.user_id = ? ORDER BY s.created_at`
    )
    .all(userId)
    .map((r) => ({ ...(r as StoreMembership) }));
}
