import type { PageRepository } from "./page-repository";
import type { ManagedPage } from "@/builder/contracts/page-contract";

/**
 * PageRepository over the admin HTTP API (/api/admin/pages).
 * Errors carry the server's Persian message so the builder can show it.
 */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
  } catch {
    throw new Error("ارتباط با سرور برقرار نشد");
  }
  const body = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (res.status === 401 && typeof window !== "undefined") {
    const next = encodeURIComponent(window.location.pathname);
    window.location.href = `/admin/login?next=${next}`;
  }
  if (!res.ok) throw new Error(body.error || `خطای سرور (${res.status})`);
  return body;
}

const base = "/api/admin/pages";

export class HttpPageRepository implements PageRepository {
  async listPages() {
    return (await request<{ pages: ManagedPage[] }>(base)).pages;
  }

  async getPage(id: string) {
    try {
      return (await request<{ page: ManagedPage }>(`${base}/${encodeURIComponent(id)}`)).page;
    } catch (e) {
      if (e instanceof Error && e.message.includes("یافت نشد")) return null;
      throw e;
    }
  }

  async getPublishedPage(id: string) {
    const res = await fetch(`/api/pages?id=${encodeURIComponent(id)}`, { cache: "no-store" });
    if (!res.ok) return null;
    return ((await res.json()) as { page: ManagedPage }).page;
  }

  async getPublishedPageBySlug(slug: string) {
    const res = await fetch(`/api/pages?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) return null;
    return ((await res.json()) as { page: ManagedPage }).page;
  }

  async createPage(input: { name: string; slug: string }) {
    return (await request<{ page: ManagedPage }>(base, { method: "POST", body: JSON.stringify(input) })).page;
  }

  async savePage(page: ManagedPage) {
    return (
      await request<{ page: ManagedPage }>(`${base}/${encodeURIComponent(page.id)}`, {
        method: "PUT",
        body: JSON.stringify({ page }),
      })
    ).page;
  }

  async deletePage(id: string) {
    await request(`${base}/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  async duplicatePage(id: string) {
    return (await request<{ page: ManagedPage }>(`${base}/${encodeURIComponent(id)}/duplicate`, { method: "POST" })).page;
  }

  async publishPage(id: string) {
    return (await request<{ page: ManagedPage }>(`${base}/${encodeURIComponent(id)}/publish`, { method: "POST" })).page;
  }

  async unpublishPage(id: string) {
    return (await request<{ page: ManagedPage }>(`${base}/${encodeURIComponent(id)}/unpublish`, { method: "POST" })).page;
  }
}

export const httpPageRepository = new HttpPageRepository();
