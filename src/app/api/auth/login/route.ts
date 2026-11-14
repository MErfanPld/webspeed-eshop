import type { NextRequest } from "next/server";
import { getDb } from "@/server/db";
import { verifyPassword } from "@/server/auth/password";
import { createSession, setSessionCookie } from "@/server/auth/session";
import { HttpError, json, publicRoute, readJson } from "@/server/http";
import { clientIp, rateLimit } from "@/server/rate-limit";

export const runtime = "nodejs";

export const POST = publicRoute(async (req: NextRequest) => {
  const ip = clientIp(req.headers);
  const body = await readJson<{ email?: unknown; password?: unknown }>(req, 10_000);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) throw new HttpError(400, "ایمیل و رمز عبور را وارد کنید.");

  const limit = rateLimit(`login:${ip}:${email}`, 8, 15 * 60_000);
  if (!limit.ok) {
    throw new HttpError(429, `تلاش‌های ناموفق زیاد بود. ${Math.ceil(limit.retryAfter / 60)} دقیقه دیگر دوباره امتحان کنید.`);
  }

  const user = getDb()
    .prepare("SELECT id, email, name, password_hash FROM users WHERE email = ?")
    .get(email) as { id: string; email: string; name: string; password_hash: string } | undefined;

  // Always run a hash comparison to keep timing similar for unknown emails
  const ok = await verifyPassword(
    password,
    user?.password_hash ?? "scrypt$00000000000000000000000000000000$" + "0".repeat(128)
  );
  if (!user || !ok) throw new HttpError(401, "ایمیل یا رمز عبور اشتباه است.");

  const { token, expires } = await createSession(user.id);
  await setSessionCookie(token, expires);
  return json({ user: { id: user.id, email: user.email, name: user.name } });
});
