import { revalidatePath } from "next/cache";
import { adminRoute, badRequest, json, notFound, readJson } from "@/server/http";
import { pageService } from "@/server/services/pages";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const GET = adminRoute<Ctx>(async (_req, { store }, { params }) => {
  const { id } = await params;
  const page = pageService.get(store.storeId, id);
  if (!page) throw notFound("صفحه یافت نشد");
  return json({ page });
});

/** Save the working draft (blocks + meta). Publishing is a separate action. */
export const PUT = adminRoute<Ctx>(async (req, { store }, { params }) => {
  const { id } = await params;
  const body = await readJson<{ page?: { id?: string } }>(req);
  if (!body.page || body.page.id !== id) throw badRequest("شناسه صفحه با آدرس مطابقت ندارد");
  return json({ page: pageService.save(store.storeId, body.page) });
});

export const DELETE = adminRoute<Ctx>(async (_req, { store }, { params }) => {
  const { id } = await params;
  const page = pageService.get(store.storeId, id);
  pageService.delete(store.storeId, id);
  if (page?.status === "published") revalidatePath(page.slug);
  return json({ ok: true });
}, "admin");
