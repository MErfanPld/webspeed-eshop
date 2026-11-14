import { adminRoute } from "@/server/http";
import { orderService } from "@/server/services/orders";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** Payment receipts are private: only store staff can view them */
export const GET = adminRoute<Ctx>(async (_req, { store }, { params }) => {
  const { id } = await params;
  const { data, mime } = orderService.receipt(store.storeId, id);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
});
