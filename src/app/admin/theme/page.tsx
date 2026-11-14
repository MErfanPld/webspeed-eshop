import ThemeForm from "@/components/admin/theme/ThemeForm";
import { adminApi } from "@/lib/api/admin";
import { normalizeTheme } from "@/lib/theme/theme";
import type { Role, Store } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function AdminThemePage() {
  const { store, role } = await adminApi<{ store: Store; role: Role }>("/admin/store");
  return <ThemeForm initial={normalizeTheme(store.settings.theme)} canEdit={role !== "editor"} />;
}
