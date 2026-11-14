/**
 * Client-side access to the store's media library (Django `/admin/media`).
 * The bundled placeholders stay available for quick prototyping.
 */
import { api } from "@/lib/api/client";
import type { MediaItem } from "@/types/api";

export type { MediaItem };

const PLACEHOLDERS: MediaItem[] = [
  "hero-1.svg", "hero-2.svg", "hero-3.svg", "banner-1.svg",
  "product-1.svg", "product-2.svg", "product-3.svg", "product-4.svg", "product-5.svg", "product-6.svg",
  "cat-1.svg", "cat-2.svg", "cat-3.svg", "cat-4.svg",
  "brand-1.svg", "brand-2.svg", "brand-3.svg", "brand-4.svg", "avatar.svg",
].map((f) => ({
  id: `ph-${f}`,
  url: `/placeholders/${f}`,
  name: f,
  mime: "image/svg+xml",
  size: 0,
  createdAt: "",
}));

/** Store media first, then placeholders. Throws ApiError when the API fails. */
export async function listMedia(): Promise<MediaItem[]> {
  const { items } = await api<{ items: MediaItem[] }>("/admin/media");
  return [...items, ...PLACEHOLDERS];
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  const fd = new FormData();
  fd.append("file", file);
  return (await api<{ item: MediaItem }>("/admin/media", { method: "POST", body: fd })).item;
}

export async function deleteMedia(id: string): Promise<void> {
  await api(`/admin/media/${encodeURIComponent(id)}`, { method: "DELETE" });
}
