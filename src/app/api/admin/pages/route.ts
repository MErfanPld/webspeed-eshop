import { adminRoute, json, readJson } from "@/server/http";
import { pageService } from "@/server/services/pages";

export const runtime = "nodejs";

export const GET = adminRoute(async (_req, { store }) => json({ pages: pageService.list(store.storeId) }));

export const POST = adminRoute(async (req, { store }) => {
  const body = await readJson<{ name: string; slug: string; type?: "landing" | "content" | "custom" }>(req, 10_000);
  return json({ page: pageService.create(store.storeId, body) }, 201);
});
