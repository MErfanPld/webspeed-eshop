"use client";

import { usePathname } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";
import type { PageBlock } from "@/builder/types";
import { useSiteLayout } from "@/builder/hooks/useSiteLayout";

export default function ShopChrome({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  /** Published global header blocks (server-provided); null → default */
  header?: PageBlock[] | null;
  footer?: PageBlock[] | null;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  // Without server-provided layout, load the published layout client-side
  const clientLayout = useSiteLayout(!isAdmin && header === undefined);
  const headerBlocks = header === undefined ? clientLayout.header : header;
  const footerBlocks = footer === undefined ? clientLayout.footer : footer;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader blocks={headerBlocks} />
      <main className="flex-1 w-full min-w-0">{children}</main>
      <SiteFooter blocks={footerBlocks} />
    </>
  );
}
