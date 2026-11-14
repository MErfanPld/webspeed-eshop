import StoresManager from "@/components/admin/stores/StoresManager";
import { requireAdmin } from "@/server/http";
import { storeService } from "@/server/services/stores";

export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  const { store, memberships } = await requireAdmin();
  const stores = memberships.map((m) => {
    const s = storeService.get(m.storeId);
    return { id: m.storeId, name: m.storeName, slug: m.storeSlug, role: m.role, domain: s?.domain ?? null };
  });
  return <StoresManager stores={stores} currentId={store.storeId} />;
}
