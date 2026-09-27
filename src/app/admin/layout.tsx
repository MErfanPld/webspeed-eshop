"use client";

import { usePathname } from "next/navigation";
import AdminShell from "@/components/admin/shell/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBuilder = pathname?.startsWith("/admin/builder");
  const isLogin = pathname === "/admin/login";

  if (isBuilder || isLogin) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
