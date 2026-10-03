"use client";

import { useSyncExternalStore } from "react";
import type { PageBlock } from "@/builder/types";
import type { ManagedPage } from "@/builder/contracts/page-contract";
import { homePageConfig } from "@/config/home-page";
import { pageRepository } from "@/builder/repositories/local-storage-repository";
import { createBlockInstance } from "@/builder/registry/block-registry";
import {
  mergeStyleIntoData,
  pickStyleData,
} from "@/builder/utils/style-keys";

export type PreviewDevice = "desktop" | "tablet" | "mobile";
export type SaveStatus = "idle" | "saving" | "saved" | "dirty" | "error";

type HistorySnapshot = {
  blocks: PageBlock[];
  selectedBlockId: string | null;
};

type BuilderState = {
  page: ManagedPage | null;
  blocks: PageBlock[];
  selectedBlockId: string | null;
  previewDevice: PreviewDevice;
  isPreview: boolean;
  isDirty: boolean;
  saveStatus: SaveStatus;
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  hydrated: boolean;
  clipboard: PageBlock[] | null;
  styleClipboard: Record<string, unknown> | null;
};

type BuilderActions = {
  loadPage: (id: string) => Promise<void>;
  selectBlock: (id: string | null) => void;
  clearSelection: () => void;
  setPreviewDevice: (d: PreviewDevice) => void;
  setIsPreview: (v: boolean) => void;
  addBlock: (type: string, index?: number) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (from: number, to: number) => void;
  moveBlockById: (id: string, direction: "up" | "down") => void;
  updateBlockData: (id: string, path: string, value: unknown) => void;
  setBlocks: (blocks: PageBlock[], recordHistory?: boolean) => void;
  undo: () => void;
  redo: () => void;
  saveDraft: () => Promise<void>;
  publish: () => Promise<void>;
  unpublish: () => Promise<void>;
  markDirty: () => void;
  toggleBlockEnabled: (id: string) => void;
  setBlockLocked: (id: string, locked: boolean) => void;
  renameBlock: (id: string, label: string) => void;
  copyBlock: (id?: string) => void;
  pasteBlock: () => void;
  copyStyle: (id?: string) => void;
  pasteStyle: (id?: string) => void;
  insertBlocks: (blocks: PageBlock[], index?: number) => void;
  updatePageMeta: (patch: Partial<{ name: string; slug: string; description: string; seoTitle: string; seoDescription: string }>) => void;
};

const MAX_HISTORY = 50;

function cloneBlocks(blocks: PageBlock[]): PageBlock[] {
  return structuredClone(blocks);
}

function setPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = cur[key];
    if (typeof next !== "object" || next === null) {
      cur[key] = {};
    }
    cur = cur[key] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

function getData(block: PageBlock): Record<string, unknown> {
  return { ...((block as { data?: Record<string, unknown> }).data || {}) };
}

function isLocked(block: PageBlock): boolean {
  return Boolean(getData(block)._locked);
}

let state: BuilderState = {
  page: null,
  blocks: [],
  selectedBlockId: null,
  previewDevice: "desktop",
  isPreview: false,
  isDirty: false,
  saveStatus: "idle",
  past: [],
  future: [],
  hydrated: false,
  clipboard: null,
  styleClipboard: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function setState(partial: Partial<BuilderState>) {
  state = { ...state, ...partial };
  emit();
}

function getState() {
  return state;
}

function recordHistoryAndSetBlocks(blocks: PageBlock[]) {
  const snapshot: HistorySnapshot = {
    blocks: cloneBlocks(state.blocks),
    selectedBlockId: state.selectedBlockId,
  };
  setState({
    blocks: cloneBlocks(blocks),
    past: [...state.past.slice(-MAX_HISTORY + 1), snapshot],
    future: [],
    isDirty: true,
    saveStatus: "dirty",
  });
}

function reId(block: PageBlock): PageBlock {
  const copy = structuredClone(block) as PageBlock;
  copy.id = `${copy.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return copy;
}

const actions: BuilderActions = {
  loadPage: async (id: string) => {
    try {
      let page = await pageRepository.getPage(id);
      if (!page) {
        setState({ page: null, blocks: [], hydrated: true });
        return;
      }
      let blocks = cloneBlocks((page.blocks || []) as unknown as PageBlock[]);
      // Restore home storefront structure if LocalStorage has empty blocks
      if (
        blocks.length === 0 &&
        id === "home" &&
        Array.isArray(homePageConfig.blocks) &&
        homePageConfig.blocks.length > 0
      ) {
        blocks = cloneBlocks(homePageConfig.blocks as unknown as PageBlock[]);
        page = {
          ...page,
          blocks: blocks as unknown as typeof page.blocks,
        };
        try {
          await pageRepository.savePage(page);
        } catch (e) {
          console.warn("[builder] failed to persist restored home blocks", e);
        }
      }
      setState({
        page,
        blocks,
        selectedBlockId: null,
        isDirty: false,
        saveStatus: "idle",
        past: [],
        future: [],
        hydrated: true,
        isPreview: false,
      });
    } catch (e) {
      console.error(e);
      setState({ page: null, blocks: [], hydrated: true, saveStatus: "error" });
    }
  },

  selectBlock: (id) => setState({ selectedBlockId: id }),
  clearSelection: () => setState({ selectedBlockId: null }),
  setPreviewDevice: (d) => setState({ previewDevice: d }),
  setIsPreview: (v) =>
    setState({
      isPreview: v,
      selectedBlockId: v ? null : state.selectedBlockId,
    }),

  markDirty: () => setState({ isDirty: true, saveStatus: "dirty" }),

  setBlocks: (blocks, recordHistory = true) => {
    if (recordHistory) recordHistoryAndSetBlocks(blocks);
    else setState({ blocks: cloneBlocks(blocks) });
  },

  addBlock: (type, index) => {
    const instance = createBlockInstance(type) as PageBlock;
    const blocks = cloneBlocks(state.blocks);
    if (typeof index === "number" && index >= 0 && index <= blocks.length) {
      blocks.splice(index, 0, instance);
    } else {
      blocks.push(instance);
    }
    recordHistoryAndSetBlocks(blocks);
    setState({ selectedBlockId: instance.id });
  },

  removeBlock: (id) => {
    const target = state.blocks.find((b) => b.id === id);
    if (target && isLocked(target)) return;
    const blocks = state.blocks.filter((b) => b.id !== id);
    recordHistoryAndSetBlocks(blocks);
    if (state.selectedBlockId === id) setState({ selectedBlockId: null });
  },

  duplicateBlock: (id) => {
    const blocks = cloneBlocks(state.blocks);
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const copy = reId(blocks[idx]);
    blocks.splice(idx + 1, 0, copy);
    recordHistoryAndSetBlocks(blocks);
    setState({ selectedBlockId: copy.id });
  },

  moveBlock: (from, to) => {
    if (from === to) return;
    const blocks = cloneBlocks(state.blocks);
    if (isLocked(blocks[from])) return;
    const [item] = blocks.splice(from, 1);
    blocks.splice(to, 0, item);
    recordHistoryAndSetBlocks(blocks);
  },

  moveBlockById: (id, direction) => {
    const blocks = cloneBlocks(state.blocks);
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx < 0 || isLocked(blocks[idx])) return;
    const next = direction === "up" ? idx - 1 : idx + 1;
    if (next < 0 || next >= blocks.length) return;
    const [item] = blocks.splice(idx, 1);
    blocks.splice(next, 0, item);
    recordHistoryAndSetBlocks(blocks);
  },

  updateBlockData: (id, path, value) => {
    const blocks = cloneBlocks(state.blocks);
    const block = blocks.find((b) => b.id === id);
    if (!block || isLocked(block)) return;
    const data = getData(block);
    setPath(data, path, value);
    (block as { data: Record<string, unknown> }).data = data;
    recordHistoryAndSetBlocks(blocks);
  },

  toggleBlockEnabled: (id) => {
    const blocks = cloneBlocks(state.blocks);
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    block.enabled = block.enabled === false ? true : false;
    recordHistoryAndSetBlocks(blocks);
  },

  setBlockLocked: (id, locked) => {
    const blocks = cloneBlocks(state.blocks);
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    const data = getData(block);
    data._locked = locked;
    (block as { data: Record<string, unknown> }).data = data;
    recordHistoryAndSetBlocks(blocks);
  },

  renameBlock: (id, label) => {
    const blocks = cloneBlocks(state.blocks);
    const block = blocks.find((b) => b.id === id);
    if (!block || isLocked(block)) return;
    const data = getData(block);
    data._label = label;
    (block as { data: Record<string, unknown> }).data = data;
    recordHistoryAndSetBlocks(blocks);
  },

  copyBlock: (id) => {
    const targetId = id ?? state.selectedBlockId;
    if (!targetId) return;
    const block = state.blocks.find((b) => b.id === targetId);
    if (!block) return;
    setState({ clipboard: [structuredClone(block)] });
  },

  pasteBlock: () => {
    if (!state.clipboard?.length) return;
    const blocks = cloneBlocks(state.blocks);
    const copies = state.clipboard.map(reId);
    const sel = state.selectedBlockId;
    const idx = sel ? blocks.findIndex((b) => b.id === sel) : -1;
    if (idx >= 0) blocks.splice(idx + 1, 0, ...copies);
    else blocks.push(...copies);
    recordHistoryAndSetBlocks(blocks);
    setState({ selectedBlockId: copies[0]?.id ?? null });
  },

  copyStyle: (id) => {
    const targetId = id ?? state.selectedBlockId;
    if (!targetId) return;
    const block = state.blocks.find((b) => b.id === targetId);
    if (!block) return;
    setState({ styleClipboard: pickStyleData(getData(block)) });
  },

  pasteStyle: (id) => {
    const targetId = id ?? state.selectedBlockId;
    if (!targetId || !state.styleClipboard) return;
    const blocks = cloneBlocks(state.blocks);
    const block = blocks.find((b) => b.id === targetId);
    if (!block || isLocked(block)) return;
    const data = mergeStyleIntoData(getData(block), state.styleClipboard);
    (block as { data: Record<string, unknown> }).data = data;
    recordHistoryAndSetBlocks(blocks);
  },

  insertBlocks: (incoming, index) => {
    const blocks = cloneBlocks(state.blocks);
    const copies = incoming.map(reId);
    if (typeof index === "number" && index >= 0 && index <= blocks.length) {
      blocks.splice(index, 0, ...copies);
    } else {
      blocks.push(...copies);
    }
    recordHistoryAndSetBlocks(blocks);
    if (copies[0]) setState({ selectedBlockId: copies[0].id });
  },

  updatePageMeta: (patch) => {
    const { page } = state;
    if (!page) return;
    const seo = { ...(page.seo || {}) };
    if (patch.seoTitle !== undefined) seo.title = patch.seoTitle;
    if (patch.seoDescription !== undefined) seo.description = patch.seoDescription;
    setState({
      page: {
        ...page,
        name: patch.name !== undefined ? patch.name : page.name,
        slug: patch.slug !== undefined ? patch.slug : page.slug,
        description:
          patch.description !== undefined ? patch.description : page.description,
        seo: Object.keys(seo).length ? seo : page.seo,
      },
      isDirty: true,
      saveStatus: "dirty",
    });
  },

  undo: () => {
    const { past, blocks, selectedBlockId, future } = state;
    if (!past.length) return;
    const prev = past[past.length - 1];
    setState({
      past: past.slice(0, -1),
      future: [
        { blocks: cloneBlocks(blocks), selectedBlockId },
        ...future,
      ].slice(0, MAX_HISTORY),
      blocks: cloneBlocks(prev.blocks),
      selectedBlockId: prev.selectedBlockId,
      isDirty: true,
      saveStatus: "dirty",
    });
  },

  redo: () => {
    const { future, blocks, selectedBlockId, past } = state;
    if (!future.length) return;
    const next = future[0];
    setState({
      future: future.slice(1),
      past: [...past, { blocks: cloneBlocks(blocks), selectedBlockId }].slice(
        -MAX_HISTORY
      ),
      blocks: cloneBlocks(next.blocks),
      selectedBlockId: next.selectedBlockId,
      isDirty: true,
      saveStatus: "dirty",
    });
  },

  saveDraft: async () => {
    const { page, blocks } = state;
    if (!page) return;
    setState({ saveStatus: "saving" });
    try {
      const updated = await pageRepository.savePage({
        ...page,
        blocks: cloneBlocks(blocks) as unknown as ManagedPage["blocks"],
      });
      setState({ page: updated, isDirty: false, saveStatus: "saved" });
    } catch (e) {
      console.error(e);
      setState({ saveStatus: "error" });
    }
  },

  publish: async () => {
    const { page, blocks } = state;
    if (!page) return;
    setState({ saveStatus: "saving" });
    try {
      await pageRepository.savePage({
        ...page,
        blocks: cloneBlocks(blocks) as unknown as ManagedPage["blocks"],
      });
      const updated = await pageRepository.publishPage(page.id);
      setState({
        page: updated,
        blocks: cloneBlocks(updated.blocks as unknown as PageBlock[]),
        isDirty: false,
        saveStatus: "saved",
      });
    } catch (e) {
      console.error(e);
      setState({ saveStatus: "error" });
    }
  },

  unpublish: async () => {
    const { page } = state;
    if (!page) return;
    setState({ saveStatus: "saving" });
    try {
      const updated = await pageRepository.unpublishPage(page.id);
      setState({ page: updated, isDirty: false, saveStatus: "saved" });
    } catch (e) {
      console.error(e);
      setState({ saveStatus: "error" });
    }
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useBuilderStore<T>(
  selector: (s: BuilderState & BuilderActions) => T
): T {
  return useSyncExternalStore(
    subscribe,
    () => selector({ ...getState(), ...actions }),
    () => selector({ ...getState(), ...actions })
  );
}
