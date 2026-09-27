import type { SerializablePageBlock } from "@/builder/contracts/page-contract";
import { toPlainJson, reassignBlockIds } from "@/builder/contracts/page-contract";

export type ReusableBlock = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  blocks: SerializablePageBlock[];
};

const KEY = "webspeed-reusable-blocks-v1";

function readAll(): ReusableBlock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: ReusableBlock[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(toPlainJson(items)));
}

export const reusableBlocksRepository = {
  list(): ReusableBlock[] {
    return readAll().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },
  save(name: string, blocks: SerializablePageBlock[]): ReusableBlock {
    const item: ReusableBlock = {
      id: `rb-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: toPlainJson(blocks),
    };
    const all = readAll();
    all.push(item);
    writeAll(all);
    return item;
  },
  insertAsBlocks(id: string): SerializablePageBlock[] {
    const item = readAll().find((x) => x.id === id);
    if (!item) return [];
    return reassignBlockIds(item.blocks);
  },
  delete(id: string) {
    writeAll(readAll().filter((x) => x.id !== id));
  },
};
