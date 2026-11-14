import type { NextRequest } from "next/server";
import { badRequest, json, notFound, publicRoute } from "@/server/http";
import { pageService } from "@/server/services/pages";
import { getStorefrontStore } from "@/server/services/stores";

export const runtime = "nodejs";

/**
 * Public: published page snapshot by `id` or `slug` for the current
 * storefront store. Drafts are never exposed here.
 */
export const GET = publicRoute(async (req: NextRequest) => {
  const store = await getStorefrontStore();
  const id = req.nextUrl.searchParams.get("id");
  const slug = req.nextUrl.searchParams.get("slug");
  if (!id && !slug) throw badRequest("id یا slug لازم است");
  const page = id ? pageService.getPublished(store.id, id) : pageService.getPublishedBySlug(store.id, slug!);
  if (!page) throw notFound("صفحه یافت نشد");
  // Only the public snapshot leaves the server
  return json({
    page: {
      ...page,
      blocks: [],
    },
  });
});
