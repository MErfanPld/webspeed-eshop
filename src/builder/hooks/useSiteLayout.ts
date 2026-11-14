"use client";

import { useEffect, useState } from "react";
import type { PageBlock } from "@/builder/types";
import { pageRepository } from "@/builder/repositories";
import { SITE_FOOTER_ID, SITE_HEADER_ID, asPageBlocks, type ManagedPage } from "@/builder/contracts/page-contract";

export type SiteLayout = { header: PageBlock[] | null; footer: PageBlock[] | null };

function published(p: ManagedPage | null): PageBlock[] | null {
  return p?.status === "published" && p.publishedBlocks?.length ? asPageBlocks(p.publishedBlocks) : null;
}

/**
 * Builder canvas: the current store's *published* global header/footer
 * (null → built-in default), loaded through the admin repository.
 */
export function useSiteLayout(enabled = true): SiteLayout {
  const [layout, setLayout] = useState<SiteLayout>({ header: null, footer: null });
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    Promise.all([
      pageRepository.getPage(SITE_HEADER_ID).catch(() => null),
      pageRepository.getPage(SITE_FOOTER_ID).catch(() => null),
    ]).then(([h, f]) => {
      if (!cancelled) setLayout({ header: published(h), footer: published(f) });
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return layout;
}
