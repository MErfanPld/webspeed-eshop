"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminShell from "./AdminShell";
import { AdminSessionProvider, type AdminSession } from "@/context/AdminSessionContext";
import { CatalogProvider, type Catalog } from "@/context/CatalogContext";
import { ConfirmHost } from "@/components/ui/ConfirmDialog";

export default function AdminFrame({
  session,
  catalog,
  children,
}: {
  session: AdminSession | null;
  catalog: Catalog | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isBuilder = pathname?.startsWith("/admin/builder");
  const isLogin = pathname === "/admin/login";

  // Stale cookie (session revoked): send to login
  useEffect(() => {
    if (!session && !isLogin) router.replace(`/admin/login?next=${encodeURIComponent(pathname || "/admin")}`);
  }, [session, isLogin, pathname, router]);

  let content: React.ReactNode = children;
  if (!isBuilder && !isLogin) content = <AdminShell>{children}</AdminShell>;
  if (catalog) content = <CatalogProvider value={catalog}>{content}</CatalogProvider>;

  return (
    <AdminSessionProvider value={session}>
      {content}
      {!isBuilder && <ConfirmHost />}
    </AdminSessionProvider>
  );
}
