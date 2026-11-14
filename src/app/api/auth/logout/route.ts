import { destroySession } from "@/server/auth/session";
import { json, publicRoute } from "@/server/http";

export const runtime = "nodejs";

export const POST = publicRoute(async () => {
  await destroySession();
  return json({ ok: true });
});
