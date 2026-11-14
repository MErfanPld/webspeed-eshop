import "server-only";
import { cookies, headers } from "next/headers";
import { ApiError } from "./client";

/**
 * Server-side calls (server components, layouts, generateMetadata).
 *
 * - Talks to Django directly via API_INTERNAL_URL (no proxy hop).
 * - Forwards the storefront host as X-Store-Host so the API picks the store
 *   for this domain.
 * - With `auth`, forwards the admin's JWT + store cookies. The middleware has
 *   already refreshed an expired access token before rendering.
 */
export function internalApiBase(): string {
  return (process.env.API_INTERNAL_URL || "http://localhost:8000/api/v1").replace(/\/+$/, "");
}

const FORWARDED_COOKIES = ["ws_access", "ws_store"];

async function requestHeaders(auth: boolean): Promise<Record<string, string>> {
  const h = await headers();
  const out: Record<string, string> = { Accept: "application/json" };
  const host = h.get("x-forwarded-host") || h.get("host");
  if (host) out["X-Store-Host"] = host;
  if (auth) {
    const jar = await cookies();
    const pairs = FORWARDED_COOKIES.map((n) => [n, jar.get(n)?.value] as const).filter(([, v]) => v);
    if (pairs.length) out.Cookie = pairs.map(([n, v]) => `${n}=${v}`).join("; ");
  }
  return out;
}

export async function serverApi<T>(path: string, opts: { auth?: boolean } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${internalApiBase()}${path}`, {
      headers: await requestHeaders(Boolean(opts.auth)),
      cache: "no-store",
    });
  } catch {
    throw new ApiError("ارتباط با سرور API برقرار نشد", 0);
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string; details?: unknown } | null;
    throw new ApiError(data?.error || `خطای سرور (${res.status})`, res.status, data?.details ?? null);
  }
  return (await res.json()) as T;
}

/** Like serverApi but returns null for 404 */
export async function serverApiOrNull<T>(path: string, opts: { auth?: boolean } = {}): Promise<T | null> {
  try {
    return await serverApi<T>(path, opts);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
