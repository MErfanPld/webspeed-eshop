import type { NextRequest } from "next/server";
import { HttpError, badRequest, json, notFound, publicRoute } from "@/server/http";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { getStorefrontStore } from "@/server/services/stores";
import { orderService } from "@/server/services/orders";

export const runtime = "nodejs";

/** Public order tracking: requires the order number AND the buyer's phone */
export const GET = publicRoute(async (req: NextRequest) => {
  const limit = rateLimit(`track:${clientIp(req.headers)}`, 20, 10 * 60_000);
  if (!limit.ok) throw new HttpError(429, "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.");
  const number = req.nextUrl.searchParams.get("number") || "";
  const phone = req.nextUrl.searchParams.get("phone") || "";
  if (!number || !phone) throw badRequest("شماره سفارش و موبایل را وارد کنید");
  const store = await getStorefrontStore();
  const o = orderService.track(store.id, number, phone);
  if (!o) throw notFound("سفارشی با این مشخصات یافت نشد");
  return json({
    order: {
      number: o.number,
      status: o.status,
      total: o.total,
      shipping: o.shipping,
      createdAt: o.createdAt,
      items: o.items.map((i) => ({ name: i.name, quantity: i.quantity, size: i.size, color: i.color, lineTotal: i.lineTotal })),
    },
  });
});
