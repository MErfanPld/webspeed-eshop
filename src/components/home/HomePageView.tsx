"use client";

import { useEffect, useState } from "react";
import { PageRenderer } from "@/builder/rendering/PageRenderer";
import type { PageBlock } from "@/builder/types";
import { asPageBlocks } from "@/builder/contracts/page-contract";
import { pageRepository } from "@/builder/repositories/local-storage-repository";

type Props = {
  /** Server-safe fallback from home-page.ts */
  fallbackBlocks: PageBlock[];
};

/**
 * Renders storefront home.
 * - First paint / SSR: fallbackBlocks (never blank)
 * - After mount: if a valid published home exists, switch to publishedBlocks
 * - Draft edits never appear until Publish
 */
export default function HomePageView({ fallbackBlocks }: Props) {
  const [blocks, setBlocks] = useState<PageBlock[]>(fallbackBlocks);
  const [source, setSource] = useState<"fallback" | "published">("fallback");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const published = await pageRepository.getPublishedPage("home");
        if (cancelled) return;

        if (
          published &&
          published.status === "published" &&
          Array.isArray(published.publishedBlocks) &&
          published.publishedBlocks.length > 0
        ) {
          setBlocks(asPageBlocks(published.publishedBlocks));
          setSource("published");
        } else {
          setBlocks(fallbackBlocks);
          setSource("fallback");
        }
      } catch (e) {
        console.warn("[HomePageView] published load failed, using fallback", e);
        if (!cancelled) {
          setBlocks(fallbackBlocks);
          setSource("fallback");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fallbackBlocks]);

  return (
    <div data-home-source={source}>
      <PageRenderer blocks={blocks} />
    </div>
  );
}
