import type { Metadata } from "next";
import ShopChrome from "@/components/layout/ShopChrome";
import { CatalogProvider } from "@/context/CatalogContext";
import { StoreInfoProvider } from "@/context/StoreInfoContext";
import { SITE_FOOTER_ID, SITE_HEADER_ID, asPageBlocks } from "@/builder/contracts/page-contract";
import { getCatalog, getPublishedPage, getStoreInfo } from "@/lib/api/storefront";
import { normalizeTheme, themeCss } from "@/lib/theme/theme";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStoreInfo();
  return {
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
    title: { default: store.name, template: `%s | ${store.name}` },
    description: store.tagline,
    openGraph: { siteName: store.name, locale: "fa_IR", type: "website" },
  };
}

/**
 * Storefront shell (server-rendered from the Django API): the store for this
 * host, its published global header/footer and its active catalog.
 */
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [store, header, footer, catalog] = await Promise.all([
    getStoreInfo(),
    getPublishedPage(SITE_HEADER_ID),
    getPublishedPage(SITE_FOOTER_ID),
    getCatalog(),
  ]);

  const css = themeCss(normalizeTheme(store.theme));

  return (
    <StoreInfoProvider
      value={{
        id: store.id,
        name: store.name,
        tagline: store.tagline ?? "",
        phone: store.phone ?? "",
        email: store.email ?? "",
        address: store.address ?? "",
        workingHours: store.workingHours ?? "",
        instagram: store.instagram ?? "",
        payment: store.payment ?? {},
        shipping: store.shipping ?? {},
      }}
    >
      {/* Store theme: only validated #rrggbb colors and numeric sizes */}
      {css && <style data-store-theme dangerouslySetInnerHTML={{ __html: css }} />}
      <CatalogProvider value={catalog}>
        <ShopChrome
          header={header?.publishedBlocks?.length ? asPageBlocks(header.publishedBlocks) : null}
          footer={footer?.publishedBlocks?.length ? asPageBlocks(footer.publishedBlocks) : null}
        >
          {children}
        </ShopChrome>
      </CatalogProvider>
    </StoreInfoProvider>
  );
}
