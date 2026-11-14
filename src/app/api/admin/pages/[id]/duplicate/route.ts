import { adminRoute, json } from "@/server/http";
import { pageService } from "@/server/services/pages";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const POST = adminRoute<Ctx>(async (_req, { store }, { params }) => {
  const { id } = await params;
  return json({ page: pageService.duplicate(store.storeId, id) }, 201);
});
