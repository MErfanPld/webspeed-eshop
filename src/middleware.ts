import { NextResponse, type NextRequest } from "next/server";
import { isPublicAdminPath } from "@/lib/admin-paths";

/**
 * Admin session guard (runs before /admin pages render).
 *
 * The Django API issues httpOnly JWT cookies (ws_access 15 min, ws_refresh).
 * Server components forward ws_access to the API, so it must be fresh:
 *  - valid access token → continue
 *  - expired/missing access but a refresh token → rotate it via the API,
 *    set the new cookies on the response AND on the forwarded request
 *  - otherwise → /admin/login?next=…
 * Signature verification happens in the API; this only checks expiry.
 */
const ACCESS = "ws_access";
const REFRESH = "ws_refresh";
const SKEW_SECONDS = 30;

function apiBase() {
  return (process.env.API_INTERNAL_URL || "http://localhost:8000/api/v1").replace(/\/+$/, "");
}

function tokenExpiry(token: string | undefined): number {
  if (!token) return 0;
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" ? json.exp : 0;
  } catch {
    return 0;
  }
}

type ParsedCookie = { name: string; value: string; maxAge?: number };

function parseSetCookie(header: string): ParsedCookie | null {
  const [pair, ...attrs] = header.split(";");
  const eq = pair.indexOf("=");
  if (eq < 0) return null;
  const out: ParsedCookie = { name: pair.slice(0, eq).trim(), value: pair.slice(eq + 1).trim() };
  for (const a of attrs) {
    const [k, v] = a.trim().split("=");
    if (k.toLowerCase() === "max-age") out.maxAge = Number(v);
  }
  return out;
}

function toLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
  const res = NextResponse.redirect(url);
  res.cookies.delete(ACCESS);
  return res;
}

/** Continue, exposing the pathname to server layouts */
function pass(req: NextRequest, headers = new Headers(req.headers)) {
  headers.set("x-ws-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

/**
 * Platform host routing (PLATFORM_DOMAIN, e.g. webspeed.ir):
 *   webspeed.ir, www.webspeed.ir → landing site (app/platform), /admin → central panel
 *   panel.webspeed.ir            → only /admin (central panel)
 *   <slug>.webspeed.ir, custom   → the store (the API resolves which one)
 * Without PLATFORM_DOMAIN (development) every host is a store and the landing
 * site is reachable at /platform.
 */
const PLATFORM_DOMAIN = (process.env.PLATFORM_DOMAIN || "").trim().toLowerCase().replace(/^\.+|\.+$/g, "");
const PANEL_HOST = PLATFORM_DOMAIN ? `${process.env.PANEL_SUBDOMAIN || "panel"}.${PLATFORM_DOMAIN}` : "";
const SHARED_FILES = new Set(["/robots.txt", "/sitemap.xml", "/favicon.ico"]);

function requestHost(req: NextRequest): string {
  return (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").split(":")[0].trim().toLowerCase();
}

function redirectTo(req: NextRequest, host: string, pathname: string) {
  const url = new URL(req.nextUrl.toString());
  url.hostname = host; // keeps the port (development)
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

/** null = continue with the normal (store / admin) handling */
function routeByHost(req: NextRequest): NextResponse | null {
  if (!PLATFORM_DOMAIN) return null;
  const host = requestHost(req);
  const path = req.nextUrl.pathname;
  if (host === PLATFORM_DOMAIN || host === `www.${PLATFORM_DOMAIN}`) {
    if (path === "/admin" || path.startsWith("/admin/")) return redirectTo(req, PANEL_HOST, path);
    if (path.startsWith("/platform") || SHARED_FILES.has(path)) return pass(req);
    const url = req.nextUrl.clone();
    url.pathname = `/platform${path === "/" ? "" : path}`;
    const headers = new Headers(req.headers);
    headers.set("x-ws-pathname", url.pathname);
    return NextResponse.rewrite(url, { request: { headers } });
  }
  if (host === PANEL_HOST) {
    if (path !== "/admin" && !path.startsWith("/admin/")) return redirectTo(req, PANEL_HOST, "/admin");
    return null;
  }
  // A store host never serves the landing site
  if (path === "/platform" || path.startsWith("/platform/")) return redirectTo(req, PLATFORM_DOMAIN, path.slice("/platform".length) || "/");
  return null;
}

export async function middleware(req: NextRequest) {
  const routed = routeByHost(req);
  if (routed) return routed;
  const path = req.nextUrl.pathname;
  if (path !== "/admin" && !path.startsWith("/admin/")) return pass(req);
  if (isPublicAdminPath(path)) return pass(req);

  const access = req.cookies.get(ACCESS)?.value;
  if (tokenExpiry(access) > Date.now() / 1000 + SKEW_SECONDS) return pass(req);

  const refresh = req.cookies.get(REFRESH)?.value;
  if (!refresh) return toLogin(req);

  let apiRes: Response;
  try {
    apiRes = await fetch(`${apiBase()}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `${REFRESH}=${refresh}`, Origin: req.nextUrl.origin, Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    return toLogin(req);
  }
  if (!apiRes.ok) return toLogin(req);

  const fresh = apiRes.headers
    .getSetCookie()
    .map(parseSetCookie)
    .filter((c): c is ParsedCookie => Boolean(c && (c.name === ACCESS || c.name === REFRESH)));
  if (!fresh.some((c) => c.name === ACCESS)) return toLogin(req);

  // Forward the new tokens to the server components of this request
  const requestCookies = new Map(req.cookies.getAll().map((c) => [c.name, c.value]));
  for (const c of fresh) requestCookies.set(c.name, c.value);
  const headers = new Headers(req.headers);
  headers.set(
    "cookie",
    Array.from(requestCookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ")
  );
  const res = pass(req, headers);
  for (const c of fresh) {
    res.cookies.set(c.name, c.value, {
      httpOnly: true,
      sameSite: "lax",
      secure: req.nextUrl.protocol === "https:",
      path: "/",
      maxAge: c.maxAge,
    });
  }
  return res;
}

export const config = {
  // Everything except Next internals, the API/media proxy and static files
  matcher: ["/((?!_next/|api/|media/|files/|fonts/|banners/|placeholders/).*)"],
};
