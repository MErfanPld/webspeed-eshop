"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageRenderer } from "@/builder/rendering/PageRenderer";
import type { PageBlock } from "@/builder/types";
import { asPageBlocks } from "@/builder/contracts/page-contract";
import { pageRepository } from "@/builder/repositories/local-storage-repository";
import type { ManagedPage } from "@/builder/contracts/page-contract";

/**
 * Catch-all for published custom builder pages.
 * Static routes (about, products, cart, …) take precedence over this.
 */
export default function CmsPage() {
  const params = useParams();
  const segments = params?.slug;
  const path =
    "/" +
    (Array.isArray(segments)
      ? segments.join("/")
      : typeof segments === "string"
        ? segments
        : "");

  const [page, setPage] = useState<ManagedPage | null | undefined>(undefined);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const published = await pageRepository.getPublishedPageBySlug(path);
        if (cancelled) return;
        if (!published) {
          setPage(null);
          return;
        }
        setPage(published);
        setBlocks(asPageBlocks(published.publishedBlocks || []));
      } catch {
        if (!cancelled) setPage(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (page === undefined) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-muted-foreground">
        در حال بارگذاری...
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-lg font-bold">صفحه یافت نشد</p>
        <p className="text-sm text-muted-foreground font-mono">{path}</p>
        <a href="/" className="text-sm font-semibold underline underline-offset-4">
          بازگشت به خانه
        </a>
      </div>
    );
  }

  return (
    <div data-cms-page={page.id} data-cms-slug={page.slug}>
      <PageRenderer blocks={blocks} />
    </div>
  );
}
