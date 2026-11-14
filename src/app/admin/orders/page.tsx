import OrdersManager from "@/components/admin/orders/OrdersManager";
import { adminApi, getAdminSession } from "@/lib/api/admin";
import type { Order } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const [{ orders }, session] = await Promise.all([adminApi<{ orders: Order[] }>("/admin/orders"), getAdminSession()]);
  return <OrdersManager orders={orders} canEdit={session?.store.role !== "editor"} />;
}
