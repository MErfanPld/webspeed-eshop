import "server-only";
import { cache } from "react";
import { serverApiOrNull } from "@/lib/api/server";
import type { ArticleFull, ArticleSummary, LandingData } from "@/lib/platform";

/** One API call per request, shared by the layout, page and metadata */
export const getLanding = cache(async (): Promise<LandingData | null> => {
  return serverApiOrNull<LandingData>("/platform/landing").catch(() => null);
});

export async function getArticles(page = 1, category?: string) {
  const qs = new URLSearchParams({ page: String(page) });
  if (category) qs.set("category", category);
  return serverApiOrNull<{
    articles: ArticleSummary[];
    categories: string[];
    pagination: { page: number; pages: number; total: number; pageSize: number };
  }>(`/platform/articles?${qs}`).catch(() => null);
}

export const getArticle = cache(async (slug: string) =>
  serverApiOrNull<{ article: ArticleFull; related: ArticleSummary[] }>(`/platform/articles/${encodeURIComponent(slug)}`).catch(() => null)
);
