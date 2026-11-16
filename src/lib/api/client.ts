/**
 * Centralized client for the Django REST API.
 *
 * Browser: calls go to NEXT_PUBLIC_API_URL (default "/api/v1", proxied to
 * Django by next.config rewrites → same-origin, httpOnly JWT cookies work).
 *  - credentials: "include"
 *  - on 401: one shared /auth/refresh call, then the request is retried once
 *  - session expired: redirect to /admin/login when inside the panel
 *  - X-Store-Host: the storefront host, so the API resolves the right store
 *  - errors: ApiError with the server's Persian message ({error, details})
 *
 * Server components use `serverApi` (src/lib/api/server.ts) instead.
 */
import { isPublicAdminPath } from "@/lib/admin-paths";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details: unknown = null
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const NETWORK_ERROR = "ارتباط با سرور برقرار نشد";

export type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Plain object → JSON; FormData → multipart (file uploads) */
  body?: unknown;
  headers?: Record<string, string>;
  /** Try refresh + retry on 401 (default true) */
  refresh?: boolean;
  /** Redirect to the login page when the session cannot be refreshed (default: inside /admin) */
  redirectOnExpire?: boolean;
  signal?: AbortSignal;
};

export function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || "/api/v1").replace(/\/+$/, "");
}

export function apiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${apiBase()}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildInit(opts: ApiOptions): RequestInit {
  const headers: Record<string, string> = { Accept: "application/json", ...(opts.headers || {}) };
  if (typeof window !== "undefined" && !headers["X-Store-Host"]) {
    headers["X-Store-Host"] = window.location.host;
  }
  let body: BodyInit | undefined;
  if (opts.body instanceof FormData) {
    body = opts.body; // browser sets the multipart boundary
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }
  return {
    method: opts.method || (body ? "POST" : "GET"),
    headers,
    body,
    credentials: "include",
    cache: "no-store",
    signal: opts.signal,
  };
}

async function parseError(res: Response): Promise<ApiError> {
  const data = (await res.json().catch(() => null)) as { error?: string; details?: unknown } | null;
  const fallback =
    res.status === 401
      ? "ابتدا وارد شوید"
      : res.status === 403
        ? "دسترسی مجاز نیست"
        : res.status === 404
          ? "یافت نشد"
          : res.status === 413
            ? "حجم فایل بیش از حد مجاز است"
            : res.status === 429
              ? "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید."
              : `خطای سرور (${res.status})`;
  return new ApiError(data?.error || fallback, res.status, data?.details ?? null);
}

/* ---------------- token refresh (single flight) ---------------- */

let refreshing: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (!refreshing) {
    refreshing = fetch(apiUrl("/auth/refresh"), {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => {
        // Let concurrent callers reuse this result, then allow a new refresh
        setTimeout(() => (refreshing = null), 0);
      });
  }
  return refreshing;
}

function onSessionExpired() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (path.startsWith("/admin") && !isPublicAdminPath(path)) {
    window.location.href = `/admin/login?next=${encodeURIComponent(path + window.location.search)}`;
  }
}

const NO_REFRESH = ["/auth/login", "/auth/refresh", "/auth/logout"];

async function send(path: string, opts: ApiOptions): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path), buildInit(opts));
  } catch (e) {
    if ((e as Error)?.name === "AbortError") throw e;
    throw new ApiError(NETWORK_ERROR, 0);
  }
  if (res.status === 401 && opts.refresh !== false && !NO_REFRESH.some((p) => path.startsWith(p))) {
    if (await refreshSession()) {
      try {
        res = await fetch(apiUrl(path), buildInit(opts));
      } catch {
        throw new ApiError(NETWORK_ERROR, 0);
      }
    }
    if (res.status === 401) {
      const redirect = opts.redirectOnExpire ?? true;
      if (redirect) onSessionExpired();
    }
  }
  return res;
}

/** JSON request; throws ApiError on non-2xx */
export async function api<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const res = await send(path, opts);
  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Binary download (e.g. files); throws ApiError on non-2xx */
export async function apiBlob(path: string, opts: ApiOptions = {}): Promise<Blob> {
  const res = await send(path, opts);
  if (!res.ok) throw await parseError(res);
  return res.blob();
}

/** User-facing message for any thrown value */
export function errorMessage(e: unknown, fallback = "خطایی رخ داد"): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}
