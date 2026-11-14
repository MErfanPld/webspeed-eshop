import { revalidatePath } from "next/cache";
import { adminRoute, json, readJson } from "@/server/http";
import { catalogService } from "@/server/services/catalog";

export const runtime = "nodejs";

export const GET = adminRoute(async (_req, { store }) =>
  json({ categories: catalogService.listCategories(store.storeId) })
);

export const POST = adminRoute(async (req, { store }) => {
  const body = await readJson<Record<string, unknown>>(req, 20_000);
  const category = catalogService.saveCategory(store.storeId, body);
  revalidatePath("/", "layout");
  return json({ category }, 201);
}, "admin");
