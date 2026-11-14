import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { HttpError, badRequest, json, publicRoute } from "@/server/http";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { getStorefrontStore } from "@/server/services/stores";
import { orderService } from "@/server/services/orders";

export const runtime = "nodejs";

/**
 * Checkout. multipart/form-data:
 *  - data: JSON { customer, items: [{ productId, size, color, quantity }] }
 *  - receipt: image file (card-to-card payment receipt)
 */
export const POST = publicRoute(async (req: NextRequest) => {
  const limit = rateLimit(`order:${clientIp(req.headers)}`, 10, 10 * 60_000);
  if (!limit.ok) throw new HttpError(429, "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.");
  if (Number(req.headers.get("content-length") || 0) > 6 * 1024 * 1024) {
    throw new HttpError(413, "حجم درخواست بیش از حد مجاز است");
  }
  const form = await req.formData().catch(() => null);
  if (!form) throw badRequest("درخواست نامعتبر است");
  let data: { customer?: Record<string, unknown>; items?: unknown } = {};
  try {
    data = JSON.parse(String(form.get("data") || "{}"));
  } catch {
    throw badRequest("درخواست نامعتبر است");
  }
  const receipt = form.get("receipt");
  const store = await getStorefrontStore();
  const order = await orderService.create(store.id, {
    customer: data.customer || {},
    items: data.items,
    receipt: receipt instanceof File ? receipt : null,
  });
  // Stock changed
  revalidatePath("/", "layout");
  return json({ order: { number: order.number, total: order.total, status: order.status } }, 201);
});
