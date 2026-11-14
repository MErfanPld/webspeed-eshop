import AdminFrame from "@/components/admin/shell/AdminFrame";
import { getCurrentUser } from "@/server/auth/session";
import { requireAdmin } from "@/server/http";
import { catalogService } from "@/server/services/catalog";
import type { AdminSession } from "@/context/AdminSessionContext";

export const dynamic = "force-dynamic";

/**
 * Admin shell (server): resolves the logged-in user, the store they are
 * working on, and that store's catalog (for product pickers in the builder).
 * Route protection itself happens in middleware + every API handler.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session: AdminSession | null = null;
  let catalog = null;
  if (await getCurrentUser()) {
    try {
      const admin = await requireAdmin();
      session = { user: admin.user, store: admin.store, memberships: admin.memberships };
      catalog = {
        products: catalogService.listProducts(admin.store.storeId, { includeInactive: true }),
        categories: catalogService.listCategories(admin.store.storeId),
      };
    } catch {
      session = null;
    }
  }
  return (
    <AdminFrame session={session} catalog={catalog}>
      {children}
    </AdminFrame>
  );
}
