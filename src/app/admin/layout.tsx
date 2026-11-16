import { headers } from "next/headers";
import { isPublicAdminPath } from "@/lib/admin-paths";
import AdminFrame from "@/components/admin/shell/AdminFrame";
import { getAdminSession } from "@/lib/api/admin";
import { serverApi } from "@/lib/api/server";
import type { Category, ProductRecord } from "@/types/api";

export const dynamic = "force-dynamic";

/**
 * Admin shell (server): resolves the logged-in user, the active store and that
 * store's catalog (for product pickers in the builder) from the Django API.
 * Route protection: middleware (token refresh) + every API call (JWT + role).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isLogin = isPublicAdminPath((await headers()).get("x-ws-pathname"));
  const session = isLogin ? null : await getAdminSession();
  let catalog = null;
  if (session) {
    const [products, categories] = await Promise.all([
      serverApi<{ products: ProductRecord[] }>("/admin/products", { auth: true }),
      serverApi<{ categories: Category[] }>("/admin/categories", { auth: true }),
    ]);
    catalog = { products: products.products, categories: categories.categories };
  }
  return (
    <AdminFrame session={session} catalog={catalog}>
      {children}
    </AdminFrame>
  );
}
