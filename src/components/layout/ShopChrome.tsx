import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";
import type { PageBlock } from "@/builder/types";

/** Storefront chrome: global header, page content, global footer */
export default function ShopChrome({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  /** Published global header blocks; null → built-in default */
  header: PageBlock[] | null;
  footer: PageBlock[] | null;
}) {
  return (
    <>
      <SiteHeader blocks={header} />
      <main className="flex-1 w-full min-w-0">{children}</main>
      <SiteFooter blocks={footer} />
    </>
  );
}
