import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser, getMemberships, type AuthUser, type Role, type StoreMembership } from "./auth/session";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export const badRequest = (msg: string, details?: unknown) => new HttpError(400, msg, details);
export const notFound = (msg = "یافت نشد") => new HttpError(404, msg);
export const forbidden = (msg = "دسترسی مجاز نیست") => new HttpError(403, msg);
export const unauthorized = (msg = "ابتدا وارد شوید") => new HttpError(401, msg);
export const conflict = (msg: string) => new HttpError(409, msg);

export function json<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json(data, typeof init === "number" ? { status: init } : init);
}

/** Turn thrown errors into JSON responses (Persian messages for the UI) */
export function errorResponse(e: unknown) {
  if (e instanceof HttpError) {
    return json({ error: e.message, details: e.details }, e.status);
  }
  console.error("[api]", e);
  return json({ error: "خطای داخلی سرور" }, 500);
}

/**
 * CSRF defence for cookie-authenticated mutations: the Origin (or Referer)
 * must match the request host. SameSite=Lax cookies already block most
 * cross-site POSTs; this closes the remaining gaps.
 */
export function assertSameOrigin(req: NextRequest) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const origin = req.headers.get("origin") || req.headers.get("referer");
  if (!origin || !host) throw forbidden("درخواست نامعتبر (Origin)");
  try {
    if (new URL(origin).host !== host) throw forbidden("درخواست از مبدأ نامعتبر");
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw forbidden("درخواست نامعتبر (Origin)");
  }
}

export async function readJson<T = unknown>(req: NextRequest, maxBytes = 2_000_000): Promise<T> {
  const len = Number(req.headers.get("content-length") || 0);
  if (len > maxBytes) throw new HttpError(413, "حجم درخواست بیش از حد مجاز است");
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, "حجم درخواست بیش از حد مجاز است");
  try {
    return JSON.parse(text) as T;
  } catch {
    throw badRequest("JSON نامعتبر است");
  }
}

export const STORE_COOKIE = "ws_store";

export type AdminContext = {
  user: AuthUser;
  store: StoreMembership;
  memberships: StoreMembership[];
};

const ROLE_RANK: Record<Role, number> = { editor: 1, admin: 2, owner: 3 };

export function hasRole(role: Role, min: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

/** Resolve the logged-in user and the store they are working on */
export async function requireAdmin(minRole: Role = "editor"): Promise<AdminContext> {
  const user = await getCurrentUser();
  if (!user) throw unauthorized();
  const memberships = getMemberships(user.id);
  if (!memberships.length) throw forbidden("به هیچ فروشگاهی دسترسی ندارید");
  const wanted = (await cookies()).get(STORE_COOKIE)?.value;
  const store = memberships.find((m) => m.storeId === wanted) ?? memberships[0];
  if (!hasRole(store.role, minRole)) throw forbidden();
  return { user, store, memberships };
}

type Handler<C> = (req: NextRequest, ctx: C) => Promise<Response> | Response;

/** Wrap an admin route: same-origin check, auth, role, error mapping */
export function adminRoute<C = unknown>(
  fn: (req: NextRequest, admin: AdminContext, ctx: C) => Promise<Response> | Response,
  minRole: Role = "editor"
): Handler<C> {
  return async (req, ctx) => {
    try {
      assertSameOrigin(req);
      const admin = await requireAdmin(minRole);
      return await fn(req, admin, ctx);
    } catch (e) {
      return errorResponse(e);
    }
  };
}

/** Wrap a public route (error mapping only, same-origin for mutations) */
export function publicRoute<C = unknown>(fn: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    try {
      assertSameOrigin(req);
      return await fn(req, ctx);
    } catch (e) {
      return errorResponse(e);
    }
  };
}
