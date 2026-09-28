/**
 * Serializable Page JSON Contract
 * --------------------------------
 * This is the single source of truth for page documents.
 * NO React components, functions, DOM nodes, or class instances.
 *
 * Field `data` (not `props`) matches the existing BlockRenderer / blocks.
 * Future API backends should accept the same shape.
 */

import type { BlockType, PageBlock } from "@/builder/types";

export type PageStatus = "draft" | "published";

export type PageType = "home" | "landing" | "content" | "custom";

/** Current schema version for migrations */
export const CURRENT_SCHEMA_VERSION = 1 as const;

/**
 * One block in a page document.
 * `data` holds only plain JSON-serializable values.
 */
export type SerializablePageBlock = {
  id: string;
  type: string;
  enabled?: boolean;
  data: Record<string, unknown>;
};

/**
 * Full page document (draft or published snapshot).
 */
export type PageDocument = {
  schemaVersion: number;
  id: string;
  name: string;
  slug: string;
  type: PageType;
  status: PageStatus;
  description?: string;
  seo?: { title?: string; description?: string; ogImage?: string };
  /** Working copy the builder edits */
  blocks: SerializablePageBlock[];
  /**
   * Last published snapshot (optional).
   * Builder always edits `blocks`; publish copies blocks → publishedBlocks.
   */
  publishedBlocks?: SerializablePageBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
};

/** Alias used across admin UI */
export type ManagedPage = PageDocument;

/** Type guard helpers */
export function isPageStatus(v: unknown): v is PageStatus {
  return v === "draft" || v === "published";
}

export function isPageType(v: unknown): v is PageType {
  return (
    v === "home" || v === "landing" || v === "content" || v === "custom"
  );
}

/** Strip non-JSON values from an object (defensive) */
export function toPlainJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Ensure block IDs are unique when cloning */
export function reassignBlockIds(
  blocks: SerializablePageBlock[]
): SerializablePageBlock[] {
  return blocks.map((b) => ({
    ...toPlainJson(b),
    id: `${b.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  }));
}

/** Cast stored blocks to the app's PageBlock union (renderer-side) */
export function asPageBlocks(blocks: SerializablePageBlock[]): PageBlock[] {
  return blocks as unknown as PageBlock[];
}

export type { BlockType, PageBlock };
