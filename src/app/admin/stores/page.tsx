import StoresManager from "@/components/admin/stores/StoresManager";
import { adminApi } from "@/lib/api/admin";
import type { Role, Store } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  const { stores } = await adminApi<{ stores: (Store & { role: Role; current: boolean })[] }>("/admin/stores");
  return (
    <StoresManager
      stores={stores.map((s) => ({ id: s.id, name: s.name, slug: s.slug, role: s.role, domain: s.domain }))}
      currentId={stores.find((s) => s.current)?.id ?? ""}
    />
  );
}
