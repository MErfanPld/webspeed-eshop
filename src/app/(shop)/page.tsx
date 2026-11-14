import type { Metadata } from "next";
import { homePageConfig } from "@/config/home-page";
import { PageRenderer } from "@/builder/rendering/PageRenderer";
import { asPageBlocks } from "@/builder/contracts/page-contract";
import type { PageBlock } from "@/builder/types";
import { getStorefrontStore } from "@/server/services/stores";
import { pageService } from "@/server/services/pages";

export const dynamic = "force-dynamic";

async function loadHome() {
  const store = await getStorefrontStore();
  return { store, page: pageService.getPublished(store.id, "home") };
}

export async function generateMetadata(): Promise<Metadata> {
  const { store, page } = await loadHome();
  const title = page?.seo?.title || store.name;
  const description = page?.seo?.description || page?.description || homePageConfig.description;
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, images: page?.seo?.ogImage ? [page.seo.ogImage] : undefined },
  };
}

/**
 * Server-rendered home: the published `home` document, or the default
 * configuration when the merchant has not published one.
 */
export default async function HomePage() {
  const { page } = await loadHome();
  const blocks: PageBlock[] = page?.publishedBlocks?.length
    ? asPageBlocks(page.publishedBlocks)
    : (homePageConfig.blocks as PageBlock[]);
  return (
    <div data-home-source={page ? "published" : "fallback"}>
      <PageRenderer blocks={blocks} />
    </div>
  );
}
