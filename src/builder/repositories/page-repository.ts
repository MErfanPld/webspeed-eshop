import type { ManagedPage } from "@/builder/contracts/page-contract";

export interface PageRepository {
  listPages(): Promise<ManagedPage[]>;
  getPage(id: string): Promise<ManagedPage | null>;
  savePage(page: ManagedPage): Promise<ManagedPage>;
  deletePage(id: string): Promise<void>;
  duplicatePage(id: string): Promise<ManagedPage>;
  publishPage(id: string): Promise<ManagedPage>;
  unpublishPage(id: string): Promise<ManagedPage>;
}

export type { ManagedPage };
