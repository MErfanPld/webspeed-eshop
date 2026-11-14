import type { Metadata } from "next";
import { homePageConfig } from "@/config/home-page";
import { PageRenderer } from "@/builder/rendering/PageRenderer";
import { asPageBlocks } from "@/builder/contracts/page-contract";
import type { PageBlock } from "@/builder/types";
import { getPublishedPage, getStoreInfo } from "@/lib/api/storefront";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [store, page] = await Promise.all([getStoreInfo(), getPublishedPage("home")]);
  const title = page?.seo?.title || store.name;
  const description = page?.seo?.description || page?.description || homePageConfig.description;
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, images: page?.seo?.ogImage ? [page.seo.ogImage] : undefined },
  };
}

/**
 * Server-rendered home: the published `home` page from the API, or the
 * default configuration when the merchant has not published one.
 */
export default async function HomePage() {
  const page = await getPublishedPage("home");
  const blocks: PageBlock[] = page?.publishedBlocks?.length
    ? asPageBlocks(page.publishedBlocks)
    : (homePageConfig.blocks as PageBlock[]);
  return (
    <div data-home-source={page ? "published" : "fallback"}>
      <PageRenderer blocks={blocks} />
    </div>
  );
}
