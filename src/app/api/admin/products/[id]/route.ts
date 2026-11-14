import { revalidatePath } from "next/cache";
import { adminRoute, json, notFound, readJson } from "@/server/http";
import { catalogService } from "@/server/services/catalog";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const GET = adminRoute<Ctx>(async (_req, { store }, { params }) => {
  const { id } = await params;
  const product = catalogService.getProduct(store.storeId, id);
  if (!product) throw notFound("محصول یافت نشد");
  return json({ product });
});

export const PUT = adminRoute<Ctx>(async (req, { store }, { params }) => {
  const { id } = await params;
  const body = await readJson<Record<string, unknown>>(req, 200_000);
  const product = catalogService.saveProduct(store.storeId, body, id);
  revalidatePath("/", "layout");
  return json({ product });
}, "admin");

export const DELETE = adminRoute<Ctx>(async (_req, { store }, { params }) => {
  const { id } = await params;
  catalogService.deleteProduct(store.storeId, id);
  revalidatePath("/", "layout");
  return json({ ok: true });
}, "admin");
