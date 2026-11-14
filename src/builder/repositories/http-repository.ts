import type { PageRepository } from "./page-repository";
import type { ManagedPage } from "@/builder/contracts/page-contract";
import { ApiError, api } from "@/lib/api/client";

/**
 * PageRepository over the Django API (`/admin/pages`, public `/pages`).
 * Paths and payloads are unchanged from the former Next.js API; only the
 * base URL (NEXT_PUBLIC_API_URL) differs. Errors carry the API's Persian message.
 */
const base = "/admin/pages";
const enc = encodeURIComponent;

export class HttpPageRepository implements PageRepository {
  async listPages() {
    return (await api<{ pages: ManagedPage[] }>(base)).pages;
  }

  async getPage(id: string) {
    try {
      return (await api<{ page: ManagedPage }>(`${base}/${enc(id)}`)).page;
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  }

  async getPublishedPage(id: string) {
    try {
      return (await api<{ page: ManagedPage }>(`/pages?id=${enc(id)}`, { refresh: false })).page;
    } catch {
      return null;
    }
  }

  async getPublishedPageBySlug(slug: string) {
    try {
      return (await api<{ page: ManagedPage }>(`/pages?slug=${enc(slug)}`, { refresh: false })).page;
    } catch {
      return null;
    }
  }

  async createPage(input: { name: string; slug: string }) {
    return (await api<{ page: ManagedPage }>(base, { method: "POST", body: input })).page;
  }

  async savePage(page: ManagedPage) {
    return (await api<{ page: ManagedPage }>(`${base}/${enc(page.id)}`, { method: "PUT", body: { page } })).page;
  }

  async deletePage(id: string) {
    await api(`${base}/${enc(id)}`, { method: "DELETE" });
  }

  async duplicatePage(id: string) {
    return (await api<{ page: ManagedPage }>(`${base}/${enc(id)}/duplicate`, { method: "POST" })).page;
  }

  async publishPage(id: string) {
    return (await api<{ page: ManagedPage }>(`${base}/${enc(id)}/publish`, { method: "POST" })).page;
  }

  async unpublishPage(id: string) {
    return (await api<{ page: ManagedPage }>(`${base}/${enc(id)}/unpublish`, { method: "POST" })).page;
  }
}

export const httpPageRepository = new HttpPageRepository();
