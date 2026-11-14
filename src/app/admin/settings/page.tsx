import StoreSettingsForm from "@/components/admin/stores/StoreSettingsForm";
import { requireAdmin } from "@/server/http";
import { storeService } from "@/server/services/stores";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { store } = await requireAdmin();
  const s = storeService.get(store.storeId)!;
  return <StoreSettingsForm store={s} canEdit={store.role !== "editor"} />;
}
