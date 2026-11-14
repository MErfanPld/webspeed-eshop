import { revalidatePath } from "next/cache";
import { adminRoute, json, readJson } from "@/server/http";
import { catalogService } from "@/server/services/catalog";

export const runtime = "nodejs";

export const GET = adminRoute(async (_req, { store }) =>
  json({ products: catalogService.listProducts(store.storeId, { includeInactive: true }) })
);

export const POST = adminRoute(async (req, { store }) => {
  const body = await readJson<Record<string, unknown>>(req, 200_000);
  const product = catalogService.saveProduct(store.storeId, body);
  revalidatePath("/", "layout");
  return json({ product }, 201);
}, "admin");
