import { errorResponse } from "@/server/http";
import { mediaService } from "@/server/services/media";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ storeId: string; id: string }> };

/** Public, immutable media files (ids are random UUIDs) */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { storeId, id } = await params;
    const { data, mime } = mediaService.read(storeId, id);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
