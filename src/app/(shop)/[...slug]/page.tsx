import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageRenderer } from "@/builder/rendering/PageRenderer";
import { asPageBlocks } from "@/builder/contracts/page-contract";
import { getStorefrontStore } from "@/server/services/stores";
import { pageService } from "@/server/services/pages";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string[] }> };

async function load(params: Props["params"]) {
  const { slug } = await params;
  const path = "/" + slug.map((s) => decodeURIComponent(s)).join("/");
  const store = await getStorefrontStore();
  return pageService.getPublishedBySlug(store.id, path);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await load(params);
  if (!page) return { title: "صفحه یافت نشد" };
  const title = page.seo?.title || page.name;
  const description = page.seo?.description || page.description;
  return {
    title,
    description,
    openGraph: { title, description, images: page.seo?.ogImage ? [page.seo.ogImage] : undefined },
  };
}

/** Published custom builder pages (server-rendered). Static routes win. */
export default async function CmsPage({ params }: Props) {
  const page = await load(params);
  if (!page) notFound();
  return (
    <div data-cms-page={page.id} data-cms-slug={page.slug}>
      <PageRenderer blocks={asPageBlocks(page.publishedBlocks || [])} />
    </div>
  );
}
