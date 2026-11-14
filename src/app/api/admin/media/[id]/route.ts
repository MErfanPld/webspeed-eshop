import { adminRoute, json } from "@/server/http";
import { mediaService } from "@/server/services/media";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const DELETE = adminRoute<Ctx>(async (_req, { store }, { params }) => {
  const { id } = await params;
  mediaService.delete(store.storeId, id);
  return json({ ok: true });
}, "admin");
