"use client";

import { useEffect, useState } from "react";
import type { PageBlock } from "@/builder/types";
import { pageRepository } from "@/builder/repositories";
import { SITE_FOOTER_ID, SITE_HEADER_ID, asPageBlocks } from "@/builder/contracts/page-contract";

export type SiteLayout = { header: PageBlock[] | null; footer: PageBlock[] | null };

/** Published global header/footer blocks (null → built-in default) */
export function useSiteLayout(enabled = true): SiteLayout {
  const [layout, setLayout] = useState<SiteLayout>({ header: null, footer: null });
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    Promise.all([
      pageRepository.getPublishedPage(SITE_HEADER_ID).catch(() => null),
      pageRepository.getPublishedPage(SITE_FOOTER_ID).catch(() => null),
    ]).then(([h, f]) => {
      if (cancelled) return;
      setLayout({
        header: h?.publishedBlocks?.length ? asPageBlocks(h.publishedBlocks) : null,
        footer: f?.publishedBlocks?.length ? asPageBlocks(f.publishedBlocks) : null,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return layout;
}
