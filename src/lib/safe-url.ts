/**
 * URL safety for merchant-provided links and media.
 * Allows relative paths, anchors, http(s), mailto and tel.
 * Blocks javascript:, data:, vbscript: and anything else.
 */
const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function isSafeUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  // Strip control chars / whitespace browsers ignore inside schemes ("java\nscript:")
  const compact = v.replace(/[\u0000-\u001F\u007F\s]+/g, "");
  if (compact.startsWith("/") && !compact.startsWith("//")) return true;
  if (compact.startsWith("#") || compact.startsWith("?")) return true;
  if (compact.startsWith("//")) return false;
  const m = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(compact);
  if (!m) return true; // relative like "products?x=1"
  return ALLOWED_PROTOCOLS.has(`${m[1].toLowerCase()}:`);
}

export function safeUrl(value: unknown, fallback = "#"): string {
  if (typeof value !== "string") return fallback;
  return isSafeUrl(value) ? value : fallback;
}

/** Embeds (iframes) must be https */
export function safeEmbedUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const u = new URL(value.trim());
    return u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Keys in block data that hold URLs */
export const URL_KEYS = new Set([
  "href",
  "ctaHref",
  "viewAllHref",
  "url",
  "src",
  "image",
  "logo",
  "avatar",
  "ogImage",
]);

/**
 * Deep-clean block data: unsafe URL values under URL_KEYS are replaced
 * by "#" (links) or "" (media). Returns a new object.
 */
export function sanitizeUrls<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => sanitizeUrls(v)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (URL_KEYS.has(k) && typeof v === "string" && !isSafeUrl(v)) {
        out[k] = k.toLowerCase().includes("href") ? "#" : "";
      } else {
        out[k] = sanitizeUrls(v);
      }
    }
    return out as T;
  }
  return value;
}
