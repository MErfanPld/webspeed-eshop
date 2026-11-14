import StoreSettingsForm from "@/components/admin/stores/StoreSettingsForm";
import { adminApi } from "@/lib/api/admin";
import type { Role, Store } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { store, role } = await adminApi<{ store: Store; role: Role }>("/admin/store");
  return <StoreSettingsForm store={store} canEdit={role !== "editor"} />;
}
