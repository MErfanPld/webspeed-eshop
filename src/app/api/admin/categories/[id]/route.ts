import { revalidatePath } from "next/cache";
import { adminRoute, json, readJson } from "@/server/http";
import { catalogService } from "@/server/services/catalog";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = adminRoute<Ctx>(async (req, { store }, { params }) => {
  const { id } = await params;
  const body = await readJson<Record<string, unknown>>(req, 20_000);
  const category = catalogService.saveCategory(store.storeId, body, id);
  revalidatePath("/", "layout");
  return json({ category });
}, "admin");

export const DELETE = adminRoute<Ctx>(async (_req, { store }, { params }) => {
  const { id } = await params;
  catalogService.deleteCategory(store.storeId, id);
  revalidatePath("/", "layout");
  return json({ ok: true });
}, "admin");
