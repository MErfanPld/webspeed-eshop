import OrdersManager from "@/components/admin/orders/OrdersManager";
import { adminApi, getAdminSession } from "@/lib/api/admin";
import type { Order, Pagination } from "@/types/api";

export const dynamic = "force-dynamic";

type Search = { page?: string; status?: string; q?: string; payment?: string };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const qs = new URLSearchParams({ page: String(Math.max(1, Number(sp.page) || 1)), pageSize: "50" });
  if (sp.status) qs.set("status", sp.status);
  if (sp.q) qs.set("q", sp.q);
  if (sp.payment) qs.set("payment", sp.payment);
  const [{ orders, pagination }, session] = await Promise.all([
    adminApi<{ orders: Order[]; pagination: Pagination }>(`/admin/orders?${qs}`),
    getAdminSession(),
  ]);
  return (
    <OrdersManager
      orders={orders}
      pagination={pagination}
      filters={{ status: sp.status, q: sp.q, payment: sp.payment }}
      canEdit={session?.store.role !== "editor"}
    />
  );
}
