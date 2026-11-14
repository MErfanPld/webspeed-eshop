import { revalidatePath } from "next/cache";
import { adminRoute, json } from "@/server/http";
import { pageService } from "@/server/services/pages";
import { isLayoutPageType } from "@/builder/contracts/page-contract";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const POST = adminRoute<Ctx>(async (_req, { store }, { params }) => {
  const { id } = await params;
  const page = pageService.unpublish(store.storeId, id);
  revalidatePath(isLayoutPageType(page.type) ? "/" : page.slug, isLayoutPageType(page.type) ? "layout" : "page");
  return json({ page });
});
