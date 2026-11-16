import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/api/storefront";

const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

// Built per request from the live catalog of the requesting store's domain
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const fixed: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.3 },
  ];
  try {
    const { products, categories } = await getCatalog();
    return [
      ...fixed,
      ...categories
        .filter((c) => c.id !== "all")
        .map((c) => ({
          url: `${SITE_URL}/products?category=${encodeURIComponent(c.slug)}`,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        })),
      ...products.map((p) => ({
        url: `${SITE_URL}/products/${encodeURIComponent(p.slug)}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        ...(p.images[0] ? { images: [p.images[0].startsWith("http") ? p.images[0] : `${SITE_URL}${p.images[0]}`] } : {}),
      })),
    ];
  } catch {
    return fixed; // API down: still serve the static part
  }
}
