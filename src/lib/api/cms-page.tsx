import "server-only";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageRenderer } from "@/builder/rendering/PageRenderer";
import { asPageBlocks } from "@/builder/contracts/page-contract";
import { getPublishedPageBySlug } from "./storefront";

/**
 * Built-in routes (about, contact…) that the merchant can override from the
 * builder: once a page with the same slug is published, it replaces the
 * default content.
 */
export async function overrideMetadata(slug: string, fallback: Metadata): Promise<Metadata> {
  const page = await getPublishedPageBySlug(slug);
  if (!page) return fallback;
  return {
    title: page.seo?.title || page.name,
    description: page.seo?.description || page.description || (fallback.description ?? undefined),
  };
}

export async function renderWithOverride(slug: string, fallback: ReactNode) {
  const page = await getPublishedPageBySlug(slug);
  if (!page) return fallback;
  return (
    <div data-cms-page={page.id} data-cms-slug={page.slug}>
      <PageRenderer blocks={asPageBlocks(page.publishedBlocks || [])} />
    </div>
  );
}
