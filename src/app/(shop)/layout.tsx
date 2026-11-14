import type { Metadata } from "next";
import ShopChrome from "@/components/layout/ShopChrome";
import { CatalogProvider } from "@/context/CatalogContext";
import { StoreInfoProvider } from "@/context/StoreInfoContext";
import { getStorefrontStore } from "@/server/services/stores";
import { pageService } from "@/server/services/pages";
import { catalogService } from "@/server/services/catalog";
import { SITE_FOOTER_ID, SITE_HEADER_ID, asPageBlocks } from "@/builder/contracts/page-contract";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStorefrontStore();
  return {
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
    title: { default: store.name, template: `%s | ${store.name}` },
    description: store.settings.tagline,
    openGraph: { siteName: store.name, locale: "fa_IR", type: "website" },
  };
}

/**
 * Storefront shell (server-rendered):
 * resolves the store for this host, its published global header/footer
 * and its catalog, then renders the shop chrome around the page.
 */
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const store = await getStorefrontStore();
  const header = pageService.getPublished(store.id, SITE_HEADER_ID);
  const footer = pageService.getPublished(store.id, SITE_FOOTER_ID);
  const catalog = {
    products: catalogService.listProducts(store.id),
    categories: catalogService.listCategories(store.id),
  };

  return (
    <StoreInfoProvider
      value={{
        id: store.id,
        name: store.name,
        tagline: store.settings.tagline ?? "",
        phone: store.settings.phone ?? "",
        email: store.settings.email ?? "",
        address: store.settings.address ?? "",
        payment: store.settings.payment ?? {},
        shipping: store.settings.shipping ?? {},
      }}
    >
      <CatalogProvider value={catalog}>
        <ShopChrome
          header={header?.publishedBlocks ? asPageBlocks(header.publishedBlocks) : null}
          footer={footer?.publishedBlocks ? asPageBlocks(footer.publishedBlocks) : null}
        >
          {children}
        </ShopChrome>
      </CatalogProvider>
    </StoreInfoProvider>
  );
}
