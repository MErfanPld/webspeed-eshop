"use client";

import { useSyncExternalStore } from "react";
import type { PageBlock } from "@/builder/types";
import type { ManagedPage } from "@/builder/contracts/page-contract";
import { homePageConfig } from "@/config/home-page";
import { pageRepository } from "@/builder/repositories";
import {
  createBlockInstance,
  regenerateIds,
} from "@/builder/registry/block-registry";
import { mergeStyleIntoData, pickStyleData } from "@/builder/utils/style-keys";
import * as tree from "./tree";

export type PreviewDevice = "desktop" | "tablet" | "mobile";
export type SaveStatus = "idle" | "saving" | "saved" | "dirty" | "error";

/** Where a dragged block would land */
export type DropTarget = {
  parentId: string | null;
  index: number;
  /** Block the indicator is drawn on, or the container for "inside" */
  anchorId: string | null;
  position: "before" | "after" | "inside";
};

export type PageMeta = Pick<ManagedPage, "name" | "slug" | "description" | "seo">;

type HistorySnapshot = {
  blocks: PageBlock[];
  meta: PageMeta | null;
  selectedBlockId: string | null;
};

export type BuilderState = {
  page: ManagedPage | null;
  blocks: PageBlock[];
  selectedBlockId: string | null;
  previewDevice: PreviewDevice;
  isPreview: boolean;
  isDirty: boolean;
  saveStatus: SaveStatus;
  /** Last persistence error message (Persian), null when OK */
  saveError: string | null;
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  hydrated: boolean;
  clipboard: PageBlock[] | null;
  styleClipboard: Record<string, unknown> | null;
  dropTarget: DropTarget | null;
  /** Show the global site header/footer around the page in the canvas */
  showSiteChrome: boolean;
};

type MetaPatch = Partial<{
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
}>;

export type BuilderActions = {
  loadPage: (id: string) => Promise<void>;
  selectBlock: (id: string | null) => void;
  clearSelection: () => void;
  setPreviewDevice: (d: PreviewDevice) => void;
  setIsPreview: (v: boolean) => void;
  setShowSiteChrome: (v: boolean) => void;
  /** Add a new block. Without a target it is placed relative to the selection. */
  addBlock: (type: string, target?: { parentId: string | null; index: number }) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  /** Move within the whole tree (drag & drop) */
  moveBlockTo: (id: string, parentId: string | null, index: number) => void;
  /** Move one step among siblings */
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
  insertBlocks: (blocks: PageBlock[], target?: { parentId: string | null; index: number }) => void;
  updatePageMeta: (patch: MetaPatch) => void;
  setDropTarget: (t: DropTarget | null) => void;
};

const MAX_HISTORY = 100;
/** Edits to the same field within this window merge into one undo step */
const COALESCE_MS = 800;

function getData(block: PageBlock): Record<string, unknown> {
  return { ...((block as { data?: Record<string, unknown> }).data || {}) };
}

export function isLocked(block: PageBlock): boolean {
  return Boolean(getData(block)._locked);
}

function setPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = cur[key];
    cur[key] = typeof next === "object" && next !== null && !Array.isArray(next) ? { ...(next as object) } : {};
    cur = cur[key] as Record<string, unknown>;
  }
  if (value === undefined) delete cur[parts[parts.length - 1]];
  else cur[parts[parts.length - 1]] = value;
}

function metaOf(page: ManagedPage | null): PageMeta | null {
  if (!page) return null;
  return { name: page.name, slug: page.slug, description: page.description, seo: page.seo };
}

function errorMessage(e: unknown): string {
  return e instanceof Error && e.message ? e.message : "ذخیره ناموفق بود";
}

/** Deep copy with fresh ids for the block and every nested item/child */
function reId(block: PageBlock): PageBlock {
  return regenerateIds(structuredClone(block)) as PageBlock;
}

/* ------------------------------------------------------------------ */
/* Store core                                                          */
/* ------------------------------------------------------------------ */

const initialState: BuilderState = {
  page: null,
  blocks: [],
  selectedBlockId: null,
  previewDevice: "desktop",
  isPreview: false,
  isDirty: false,
  saveStatus: "idle",
  saveError: null,
  past: [],
  future: [],
  hydrated: false,
  clipboard: null,
  styleClipboard: null,
  dropTarget: null,
  showSiteChrome: true,
};

let state: BuilderState = initialState;
let lastCoalesce: { key: string; at: number } | null = null;
const listeners = new Set<() => void>();

function setState(partial: Partial<BuilderState>) {
  state = { ...state, ...partial };
  snapshot = { ...state, ...actions };
  listeners.forEach((l) => l());
}

export function getBuilderState(): BuilderState {
  return state;
}

/** Test helper */
export function resetBuilderStore() {
  lastCoalesce = null;
  setState({ ...initialState });
}

/**
 * Commit a new block tree.
 * `coalesceKey`: consecutive commits with the same key inside COALESCE_MS
 * update the current state without adding another undo step (typing).
 */
function commit(blocks: PageBlock[], opts: { coalesceKey?: string; selectedBlockId?: string | null } = {}) {
  if (blocks === state.blocks && opts.selectedBlockId === undefined) return;
  const now = Date.now();
  const merge =
    opts.coalesceKey !== undefined &&
    lastCoalesce?.key === opts.coalesceKey &&
    now - lastCoalesce.at < COALESCE_MS &&
    state.past.length > 0;
  lastCoalesce = opts.coalesceKey !== undefined ? { key: opts.coalesceKey, at: now } : null;

  const past = merge
    ? state.past
    : [
        ...state.past.slice(-(MAX_HISTORY - 1)),
        { blocks: state.blocks, meta: metaOf(state.page), selectedBlockId: state.selectedBlockId },
      ];

  setState({
    blocks,
    past,
    future: [],
    isDirty: true,
    saveStatus: "dirty",
    ...(opts.selectedBlockId !== undefined ? { selectedBlockId: opts.selectedBlockId } : {}),
  });
}

/** Where to insert relative to the current selection */
function insertionPointForSelection(): { parentId: string | null; index: number } {
  const sel = state.selectedBlockId ? tree.findBlock(state.blocks, state.selectedBlockId) : null;
  if (!sel) return { parentId: null, index: state.blocks.length };
  if (tree.isContainer(sel.block) && !isLocked(sel.block)) {
    return { parentId: sel.block.id, index: tree.getChildren(sel.block).length };
  }
  return { parentId: sel.parentId, index: sel.index + 1 };
}

function placeBlocks(items: PageBlock[], target?: { parentId: string | null; index: number }) {
  if (!items.length) return;
  let point = target ?? insertionPointForSelection();
  if (!items.every((b) => tree.canDrop(state.blocks, b.type, point.parentId))) {
    // Fall back to root after the top-level ancestor
    point = { parentId: null, index: state.blocks.length };
  }
  commit(tree.insertBlocks(state.blocks, point.parentId, point.index, items), {
    selectedBlockId: items[0].id,
  });
}

function mutateBlock(id: string, fn: (b: PageBlock) => PageBlock, opts: { coalesceKey?: string; allowLocked?: boolean } = {}) {
  const loc = tree.findBlock(state.blocks, id);
  if (!loc) return;
  if (!opts.allowLocked && isLocked(loc.block)) return;
  commit(tree.updateBlock(state.blocks, id, fn), { coalesceKey: opts.coalesceKey });
}

async function persist(page: ManagedPage, blocks: PageBlock[]): Promise<ManagedPage> {
  return pageRepository.savePage({
    ...page,
    blocks: structuredClone(blocks) as unknown as ManagedPage["blocks"],
  });
}

const actions: BuilderActions = {
  loadPage: async (id) => {
    setState({ ...initialState, previewDevice: state.previewDevice, showSiteChrome: state.showSiteChrome });
    lastCoalesce = null;
    try {
      let page = await pageRepository.getPage(id);
      if (!page) {
        setState({ page: null, blocks: [], hydrated: true });
        return;
      }
      let blocks = structuredClone((page.blocks || []) as unknown as PageBlock[]);
      // First-time home: start from the default storefront structure
      if (blocks.length === 0 && page.type === "home" && !page.publishedAt && homePageConfig.blocks.length > 0) {
        blocks = structuredClone(homePageConfig.blocks as unknown as PageBlock[]);
        page = { ...page, blocks: blocks as unknown as ManagedPage["blocks"] };
      }
      setState({ page, blocks, hydrated: true });
    } catch (e) {
      console.error(e);
      setState({ page: null, blocks: [], hydrated: true, saveStatus: "error", saveError: errorMessage(e) });
    }
  },

  selectBlock: (id) => setState({ selectedBlockId: id }),
  clearSelection: () => setState({ selectedBlockId: null }),
  setPreviewDevice: (d) => setState({ previewDevice: d }),
  setIsPreview: (v) => setState({ isPreview: v, selectedBlockId: v ? null : state.selectedBlockId, dropTarget: null }),
  setShowSiteChrome: (v) => setState({ showSiteChrome: v }),
  setDropTarget: (t) => {
    const cur = state.dropTarget;
    if (
      cur === t ||
      (cur && t && cur.parentId === t.parentId && cur.index === t.index && cur.anchorId === t.anchorId && cur.position === t.position)
    ) {
      return;
    }
    setState({ dropTarget: t });
  },

  markDirty: () => setState({ isDirty: true, saveStatus: "dirty" }),

  setBlocks: (blocks, recordHistory = true) => {
    if (recordHistory) commit(structuredClone(blocks));
    else setState({ blocks: structuredClone(blocks) });
  },

  addBlock: (type, target) => {
    placeBlocks([createBlockInstance(type) as PageBlock], target);
  },

  insertBlocks: (incoming, target) => {
    placeBlocks(incoming.map(reId), target);
  },

  removeBlock: (id) => {
    const loc = tree.findBlock(state.blocks, id);
    if (!loc || isLocked(loc.block)) return;
    commit(tree.removeBlock(state.blocks, id), {
      selectedBlockId: state.selectedBlockId === id || (state.selectedBlockId && tree.isDescendant(state.blocks, id, state.selectedBlockId))
        ? null
        : state.selectedBlockId,
    });
  },

  duplicateBlock: (id) => {
    const loc = tree.findBlock(state.blocks, id);
    if (!loc) return;
    const copy = reId(loc.block);
    commit(tree.insertBlocks(state.blocks, loc.parentId, loc.index + 1, [copy]), { selectedBlockId: copy.id });
  },

  moveBlockTo: (id, parentId, index) => {
    const loc = tree.findBlock(state.blocks, id);
    if (!loc || isLocked(loc.block)) return;
    const next = tree.moveBlock(state.blocks, id, parentId, index);
    if (next !== state.blocks) commit(next, { selectedBlockId: id });
  },

  moveBlockById: (id, direction) => {
    const loc = tree.findBlock(state.blocks, id);
    if (!loc || isLocked(loc.block)) return;
    const siblings = tree.getSiblings(state.blocks, loc.parentId);
    const next = direction === "up" ? loc.index - 1 : loc.index + 2;
    if (next < 0 || next > siblings.length) return;
    actions.moveBlockTo(id, loc.parentId, next);
  },

  updateBlockData: (id, path, value) => {
    mutateBlock(
      id,
      (b) => {
        const data = getData(b);
        setPath(data, path, value);
        return { ...b, data } as PageBlock;
      },
      { coalesceKey: `${id}:${path}` }
    );
  },

  toggleBlockEnabled: (id) => {
    mutateBlock(id, (b) => ({ ...b, enabled: b.enabled === false }) as PageBlock);
  },

  setBlockLocked: (id, locked) => {
    mutateBlock(
      id,
      (b) => {
        const data = getData(b);
        if (locked) data._locked = true;
        else delete data._locked;
        return { ...b, data } as PageBlock;
      },
      { allowLocked: true }
    );
  },

  renameBlock: (id, label) => {
    mutateBlock(
      id,
      (b) => {
        const data = getData(b);
        if (label.trim()) data._label = label.trim();
        else delete data._label;
        return { ...b, data } as PageBlock;
      },
      { coalesceKey: `${id}:_label` }
    );
  },

  copyBlock: (id) => {
    const targetId = id ?? state.selectedBlockId;
    if (!targetId) return;
    const loc = tree.findBlock(state.blocks, targetId);
    if (loc) setState({ clipboard: [structuredClone(loc.block)] });
  },

  pasteBlock: () => {
    if (!state.clipboard?.length) return;
    const sel = state.selectedBlockId ? tree.findBlock(state.blocks, state.selectedBlockId) : null;
    // Paste goes *after* the selection (not inside), like most editors
    placeBlocks(state.clipboard.map(reId), sel ? { parentId: sel.parentId, index: sel.index + 1 } : undefined);
  },

  copyStyle: (id) => {
    const targetId = id ?? state.selectedBlockId;
    if (!targetId) return;
    const loc = tree.findBlock(state.blocks, targetId);
    if (loc) setState({ styleClipboard: pickStyleData(getData(loc.block)) });
  },

  pasteStyle: (id) => {
    const targetId = id ?? state.selectedBlockId;
    if (!targetId || !state.styleClipboard) return;
    const style = state.styleClipboard;
    mutateBlock(targetId, (b) => ({ ...b, data: mergeStyleIntoData(getData(b), style) }) as PageBlock);
  },

  updatePageMeta: (patch) => {
    const { page } = state;
    if (!page) return;
    const seo = { ...(page.seo || {}) };
    if (patch.seoTitle !== undefined) seo.title = patch.seoTitle;
    if (patch.seoDescription !== undefined) seo.description = patch.seoDescription;
    if (patch.ogImage !== undefined) seo.ogImage = patch.ogImage;
    const key = `meta:${Object.keys(patch).join(",")}`;
    const now = Date.now();
    const merge = lastCoalesce?.key === key && now - lastCoalesce.at < COALESCE_MS && state.past.length > 0;
    lastCoalesce = { key, at: now };
    setState({
      page: {
        ...page,
        name: patch.name ?? page.name,
        slug: patch.slug ?? page.slug,
        description: patch.description ?? page.description,
        seo: Object.values(seo).some(Boolean) ? seo : undefined,
      },
      past: merge
        ? state.past
        : [...state.past.slice(-(MAX_HISTORY - 1)), { blocks: state.blocks, meta: metaOf(page), selectedBlockId: state.selectedBlockId }],
      future: [],
      isDirty: true,
      saveStatus: "dirty",
    });
  },

  undo: () => {
    const { past, future } = state;
    if (!past.length) return;
    lastCoalesce = null;
    const prev = past[past.length - 1];
    setState({
      past: past.slice(0, -1),
      future: [{ blocks: state.blocks, meta: metaOf(state.page), selectedBlockId: state.selectedBlockId }, ...future].slice(0, MAX_HISTORY),
      blocks: prev.blocks,
      page: state.page && prev.meta ? { ...state.page, ...prev.meta } : state.page,
      selectedBlockId: prev.selectedBlockId,
      isDirty: true,
      saveStatus: "dirty",
    });
  },

  redo: () => {
    const { future, past } = state;
    if (!future.length) return;
    lastCoalesce = null;
    const next = future[0];
    setState({
      future: future.slice(1),
      past: [...past, { blocks: state.blocks, meta: metaOf(state.page), selectedBlockId: state.selectedBlockId }].slice(-MAX_HISTORY),
      blocks: next.blocks,
      page: state.page && next.meta ? { ...state.page, ...next.meta } : state.page,
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
      const updated = await persist(page, blocks);
      // Edits made while the save was in flight stay dirty
      const changedMeanwhile = state.blocks !== blocks || state.page !== page;
      setState({
        page: changedMeanwhile ? { ...updated, ...metaOf(state.page) } : updated,
        isDirty: changedMeanwhile,
        saveStatus: changedMeanwhile ? "dirty" : "saved",
        saveError: null,
      });
    } catch (e) {
      console.error(e);
      setState({ saveStatus: "error", saveError: errorMessage(e) });
    }
  },

  publish: async () => {
    const { page, blocks } = state;
    if (!page) return;
    setState({ saveStatus: "saving" });
    try {
      await persist(page, blocks);
      const updated = await pageRepository.publishPage(page.id);
      const changedMeanwhile = state.blocks !== blocks;
      setState({
        page: updated,
        isDirty: changedMeanwhile,
        saveStatus: changedMeanwhile ? "dirty" : "saved",
        saveError: null,
      });
    } catch (e) {
      console.error(e);
      setState({ saveStatus: "error", saveError: errorMessage(e) });
    }
  },

  unpublish: async () => {
    const { page, blocks } = state;
    if (!page) return;
    setState({ saveStatus: "saving" });
    try {
      // Persist pending edits first so they are not silently dropped
      await persist(page, blocks);
      const updated = await pageRepository.unpublishPage(page.id);
      setState({ page: updated, isDirty: false, saveStatus: "saved", saveError: null });
    } catch (e) {
      console.error(e);
      setState({ saveStatus: "error", saveError: errorMessage(e) });
    }
  },
};

let snapshot: BuilderState & BuilderActions = { ...state, ...actions };

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const builderActions = actions;

export function useBuilderStore<T>(selector: (s: BuilderState & BuilderActions) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(snapshot),
    () => selector(snapshot)
  );
}
