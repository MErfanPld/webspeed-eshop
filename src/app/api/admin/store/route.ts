import { cookies } from "next/headers";
import { STORE_COOKIE, adminRoute, badRequest, forbidden, json, readJson } from "@/server/http";
import { storeService, type StoreSettings } from "@/server/services/stores";
import { secureCookies } from "@/server/auth/session";

export const runtime = "nodejs";

/** Current store details */
export const GET = adminRoute(async (_req, { store, memberships }) =>
  json({ store: storeService.get(store.storeId), role: store.role, memberships })
);

/** Update current store (name, domain, settings) — admin+ */
export const PATCH = adminRoute(async (req, { store }) => {
  const body = await readJson<{ name?: string; domain?: string | null; settings?: StoreSettings }>(req, 50_000);
  return json({ store: storeService.update(store.storeId, body) });
}, "admin");

/** Switch store (POST {storeId}) or create one (POST {create: {name, slug, domain}}) */
export const POST = adminRoute(async (req, { user, memberships }) => {
  const body = await readJson<{ storeId?: string; create?: { name: string; slug: string; domain?: string } }>(req, 10_000);
  const jar = await cookies();
  const setStore = (id: string) =>
    jar.set(STORE_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: secureCookies(), path: "/" });

  if (body.create) {
    const created = storeService.create({ ...body.create, ownerId: user.id });
    setStore(created.id);
    return json({ store: created }, 201);
  }
  if (!body.storeId) throw badRequest("storeId الزامی است");
  if (!memberships.some((m) => m.storeId === body.storeId)) throw forbidden("به این فروشگاه دسترسی ندارید");
  setStore(body.storeId);
  return json({ ok: true });
});
