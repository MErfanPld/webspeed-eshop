import { adminRoute, json, notFound, readJson } from "@/server/http";
import { orderService, type OrderStatus } from "@/server/services/orders";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const GET = adminRoute<Ctx>(async (_req, { store }, { params }) => {
  const { id } = await params;
  const order = orderService.get(store.storeId, id);
  if (!order) throw notFound("سفارش یافت نشد");
  return json({ order });
});

export const PATCH = adminRoute<Ctx>(async (req, { store }, { params }) => {
  const { id } = await params;
  const body = await readJson<{ status: OrderStatus; note?: string }>(req, 10_000);
  return json({ order: orderService.updateStatus(store.storeId, id, body.status, body.note) });
}, "admin");
