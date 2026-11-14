import type { ManagedPage } from "@/builder/contracts/page-contract";

/**
 * Persistence abstraction.
 * Builder UI and Storefront depend ONLY on this interface.
 */
export interface PageRepository {
  listPages(): Promise<ManagedPage[]>;
  getPage(id: string): Promise<ManagedPage | null>;
  /** Published snapshot only — for storefront rendering */
  getPublishedPage(id: string): Promise<ManagedPage | null>;
  /** Published page by public URL slug */
  getPublishedPageBySlug(slug: string): Promise<ManagedPage | null>;
  /** Create a new custom page (server assigns id, validates slug) */
  createPage(input: { name: string; slug: string }): Promise<ManagedPage>;
  savePage(page: ManagedPage): Promise<ManagedPage>;
  deletePage(id: string): Promise<void>;
  duplicatePage(id: string): Promise<ManagedPage>;
  publishPage(id: string): Promise<ManagedPage>;
  unpublishPage(id: string): Promise<ManagedPage>;
}

export type { ManagedPage };
