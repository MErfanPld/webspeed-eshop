/**
 * Serializable Page JSON Contract
 * Field `data` matches existing BlockRenderer / blocks.
 */

import type { BlockType, PageBlock } from "@/builder/types";

export type PageStatus = "draft" | "published";
export type PageType = "home" | "landing" | "content" | "custom";
export const CURRENT_SCHEMA_VERSION = 1 as const;

export type SerializablePageBlock = {
  id: string;
  type: string;
  enabled?: boolean;
  data: Record<string, unknown>;
};

export type PageDocument = {
  schemaVersion: number;
  id: string;
  name: string;
  slug: string;
  type: PageType;
  status: PageStatus;
  description?: string;
  blocks: SerializablePageBlock[];
  publishedBlocks?: SerializablePageBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
};

export type ManagedPage = PageDocument;

export function isPageStatus(v: unknown): v is PageStatus {
  return v === "draft" || v === "published";
}

export function isPageType(v: unknown): v is PageType {
  return v === "home" || v === "landing" || v === "content" || v === "custom";
}

export function toPlainJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function reassignBlockIds(
  blocks: SerializablePageBlock[]
): SerializablePageBlock[] {
  return blocks.map((b) => ({
    ...toPlainJson(b),
    id: `${b.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  }));
}

export function asPageBlocks(blocks: SerializablePageBlock[]): PageBlock[] {
  return blocks as unknown as PageBlock[];
}

export type { BlockType, PageBlock };
