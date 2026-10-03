/** Normalize user input to a URL path starting with / */
export function normalizeSlug(input: string): string {
  let s = (input || "").trim().toLowerCase();
  s = s.replace(/\s+/g, "-");
  s = s.replace(/[^a-z0-9\u0600-\u06FF\/_-]/g, "");
  s = s.replace(/\/+/g, "/");
  s = s.replace(/-+/g, "-");
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s || "/";
}

const RESERVED = new Set([
  "/",
  "/admin",
  "/login",
  "/cart",
  "/checkout",
  "/products",
  "/profile",
  "/api",
]);

export function isReservedSlug(slug: string): boolean {
  const n = normalizeSlug(slug);
  if (RESERVED.has(n)) return true;
  if (n.startsWith("/admin")) return true;
  if (n.startsWith("/products/")) return true;
  if (n.startsWith("/api/")) return true;
  return false;
}

/** Valid path: /segment or /a/b */
export function isValidSlug(slug: string): boolean {
  const n = normalizeSlug(slug);
  if (n === "/") return true;
  return /^\/[a-z0-9\u0600-\u06FF_-]+(\/[a-z0-9\u0600-\u06FF_-]+)*$/i.test(n);
}

export function slugFromName(name: string): string {
  const base = (name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF_-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalizeSlug(base || `page-${Date.now()}`);
}
