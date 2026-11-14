import type { NextRequest } from "next/server";
import { HttpError, adminRoute, badRequest, json } from "@/server/http";
import { MAX_UPLOAD_BYTES, mediaService } from "@/server/services/media";

export const runtime = "nodejs";

export const GET = adminRoute(async (_req, { store }) => json({ items: mediaService.list(store.storeId) }));

export const POST = adminRoute(async (req: NextRequest, { store }) => {
  if (Number(req.headers.get("content-length") || 0) > MAX_UPLOAD_BYTES + 64_000) {
    throw new HttpError(413, "حداکثر حجم فایل ۵ مگابایت است");
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) throw badRequest("فایلی ارسال نشده است");
  return json({ item: await mediaService.upload(store.storeId, file) }, 201);
});
