/**
 * Client-side access to the media library.
 * Falls back to the bundled placeholders when the API is unavailable.
 */
export type MediaItem = {
  id: string;
  url: string;
  name: string;
  mime?: string;
  size?: number;
};

const PLACEHOLDERS: MediaItem[] = [
  "hero-1.svg", "hero-2.svg", "hero-3.svg", "banner-1.svg",
  "product-1.svg", "product-2.svg", "product-3.svg", "product-4.svg", "product-5.svg", "product-6.svg",
  "cat-1.svg", "cat-2.svg", "cat-3.svg", "cat-4.svg",
  "brand-1.svg", "brand-2.svg", "brand-3.svg", "brand-4.svg", "avatar.svg",
].map((f) => ({ id: `ph-${f}`, url: `/placeholders/${f}`, name: f, mime: "image/svg+xml" }));

export async function listMedia(): Promise<MediaItem[]> {
  try {
    const res = await fetch("/api/admin/media", { cache: "no-store" });
    if (!res.ok) return PLACEHOLDERS;
    const json = (await res.json()) as { items?: MediaItem[] };
    return [...(json.items ?? []), ...PLACEHOLDERS];
  } catch {
    return PLACEHOLDERS;
  }
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", body: fd });
  const json = (await res.json().catch(() => ({}))) as { item?: MediaItem; error?: string };
  if (!res.ok || !json.item) throw new Error(json.error || "آپلود ناموفق بود");
  return json.item;
}
