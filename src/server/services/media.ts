import "server-only";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getDb } from "../db";
import { dataDir } from "../env";
import { HttpError, badRequest, notFound } from "../http";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type MediaItem = {
  id: string;
  name: string;
  mime: string;
  size: number;
  url: string;
  createdAt: string;
};

/**
 * Detect the real image type from magic bytes (never trust the browser's
 * MIME type or extension). SVG is intentionally not accepted: it can carry
 * scripts.
 */
export function sniffImage(buf: Uint8Array): { mime: string; ext: string } | null {
  const b = buf;
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { mime: "image/png", ext: "png" };
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (b.length >= 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return { mime: "image/gif", ext: "gif" };
  if (
    b.length >= 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
}

function storeDir(storeId: string) {
  return path.join(dataDir(), "media", storeId);
}

function fileFor(storeId: string, id: string, mime: string) {
  const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
  return path.join(storeDir(storeId), `${id}.${ext}`);
}

export function mediaUrl(storeId: string, id: string) {
  return `/api/media/${storeId}/${id}`;
}

type Row = { id: string; name: string; mime: string; size: number; created_at: string };

const ID_RE = /^[a-f0-9-]{36}$/;

export const mediaService = {
  list(storeId: string): MediaItem[] {
    return (getDb()
      .prepare("SELECT id, name, mime, size, created_at FROM media WHERE store_id = ? ORDER BY created_at DESC")
      .all(storeId) as Row[]).map((r) => ({
      id: r.id,
      name: r.name,
      mime: r.mime,
      size: r.size,
      createdAt: r.created_at,
      url: mediaUrl(storeId, r.id),
    }));
  },

  async upload(storeId: string, file: File): Promise<MediaItem> {
    if (!file || typeof file.arrayBuffer !== "function") throw badRequest("فایلی ارسال نشده است");
    if (file.size === 0) throw badRequest("فایل خالی است");
    if (file.size > MAX_UPLOAD_BYTES) throw new HttpError(413, "حداکثر حجم فایل ۵ مگابایت است");
    const buf = new Uint8Array(await file.arrayBuffer());
    const kind = sniffImage(buf);
    if (!kind) throw badRequest("فقط تصاویر PNG، JPG، WEBP یا GIF مجاز هستند");
    const id = randomUUID();
    const name = (file.name || `image.${kind.ext}`).replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120);
    fs.mkdirSync(storeDir(storeId), { recursive: true });
    fs.writeFileSync(fileFor(storeId, id, kind.mime), buf);
    const now = new Date().toISOString();
    getDb()
      .prepare("INSERT INTO media (store_id, id, name, mime, size, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .run(storeId, id, name, kind.mime, buf.byteLength, now);
    return { id, name, mime: kind.mime, size: buf.byteLength, createdAt: now, url: mediaUrl(storeId, id) };
  },

  read(storeId: string, id: string): { data: Buffer; mime: string } {
    if (!ID_RE.test(id) || !ID_RE.test(storeId)) throw notFound();
    const row = getDb().prepare("SELECT mime FROM media WHERE store_id = ? AND id = ?").get(storeId, id) as
      | { mime: string }
      | undefined;
    if (!row) throw notFound();
    const file = fileFor(storeId, id, row.mime);
    if (!fs.existsSync(file)) throw notFound();
    return { data: fs.readFileSync(file), mime: row.mime };
  },

  delete(storeId: string, id: string) {
    const row = getDb().prepare("SELECT mime FROM media WHERE store_id = ? AND id = ?").get(storeId, id) as
      | { mime: string }
      | undefined;
    if (!row) throw notFound("فایل یافت نشد");
    getDb().prepare("DELETE FROM media WHERE store_id = ? AND id = ?").run(storeId, id);
    fs.rmSync(fileFor(storeId, id, row.mime), { force: true });
  },
};
