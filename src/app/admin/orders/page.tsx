import OrdersManager from "@/components/admin/orders/OrdersManager";
import { requireAdmin } from "@/server/http";
import { orderService } from "@/server/services/orders";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const { store, store: { role } } = await requireAdmin();
  return <OrdersManager orders={orderService.list(store.storeId)} canEdit={role !== "editor"} />;
}
