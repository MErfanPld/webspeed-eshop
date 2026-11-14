import type { NextRequest } from "next/server";
import { adminRoute, json } from "@/server/http";
import { orderService } from "@/server/services/orders";

export const runtime = "nodejs";

export const GET = adminRoute(async (req: NextRequest, { store }) => {
  const sp = req.nextUrl.searchParams;
  return json({
    orders: orderService.list(store.storeId, {
      status: sp.get("status") || undefined,
      q: sp.get("q") || undefined,
    }),
  });
});
