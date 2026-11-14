/**
 * Pure, immutable helpers for the block tree.
 * Root blocks live in an array; container blocks keep children in
 * `data.children`. Every helper returns new arrays/objects and never mutates
 * its input, which keeps undo/redo snapshots safe.
 */
import type { PageBlock } from "@/builder/types";
import { getBlockDefinition } from "@/builder/registry/block-registry";

type AnyBlock = PageBlock & { data?: Record<string, unknown> };

export type BlockLocation = {
  block: PageBlock;
  parentId: string | null;
  index: number;
  depth: number;
};

export function getChildren(block: PageBlock): PageBlock[] {
  const c = (block as AnyBlock).data?.children;
  return Array.isArray(c) ? (c as PageBlock[]) : [];
}

function withChildren(block: PageBlock, children: PageBlock[]): PageBlock {
  const b = block as AnyBlock;
  return { ...b, data: { ...(b.data || {}), children } } as PageBlock;
}

export function isContainer(block: PageBlock | string): boolean {
  const type = typeof block === "string" ? block : block.type;
  return Boolean(getBlockDefinition(type)?.nesting?.canHaveChildren);
}

export function findBlock(
  blocks: PageBlock[],
  id: string,
  parentId: string | null = null,
  depth = 0
): BlockLocation | null {
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.id === id) return { block: b, parentId, index: i, depth };
    const kids = getChildren(b);
    if (kids.length) {
      const found = findBlock(kids, id, b.id, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

/** Sibling list that contains `parentId`'s children (null = root) */
export function getSiblings(blocks: PageBlock[], parentId: string | null): PageBlock[] {
  if (parentId === null) return blocks;
  const loc = findBlock(blocks, parentId);
  return loc ? getChildren(loc.block) : [];
}

/** Map over the tree, replacing the block with `id` by `fn(block)` */
export function updateBlock(
  blocks: PageBlock[],
  id: string,
  fn: (b: PageBlock) => PageBlock
): PageBlock[] {
  let changed = false;
  const next = blocks.map((b) => {
    if (b.id === id) {
      changed = true;
      return fn(b);
    }
    const kids = getChildren(b);
    if (kids.length) {
      const updated = updateBlock(kids, id, fn);
      if (updated !== kids) {
        changed = true;
        return withChildren(b, updated);
      }
    }
    return b;
  });
  return changed ? next : blocks;
}

export function removeBlock(blocks: PageBlock[], id: string): PageBlock[] {
  const idx = blocks.findIndex((b) => b.id === id);
  if (idx >= 0) return [...blocks.slice(0, idx), ...blocks.slice(idx + 1)];
  let changed = false;
  const next = blocks.map((b) => {
    const kids = getChildren(b);
    if (!kids.length) return b;
    const updated = removeBlock(kids, id);
    if (updated !== kids) {
      changed = true;
      return withChildren(b, updated);
    }
    return b;
  });
  return changed ? next : blocks;
}

export function insertBlocks(
  blocks: PageBlock[],
  parentId: string | null,
  index: number,
  items: PageBlock[]
): PageBlock[] {
  if (parentId === null) {
    const i = Math.max(0, Math.min(index, blocks.length));
    return [...blocks.slice(0, i), ...items, ...blocks.slice(i)];
  }
  return updateBlock(blocks, parentId, (parent) => {
    const kids = getChildren(parent);
    const i = Math.max(0, Math.min(index, kids.length));
    return withChildren(parent, [...kids.slice(0, i), ...items, ...kids.slice(i)]);
  });
}

export function isDescendant(blocks: PageBlock[], ancestorId: string, id: string): boolean {
  const anc = findBlock(blocks, ancestorId);
  if (!anc) return false;
  return Boolean(findBlock(getChildren(anc.block), id));
}

/** Depth of the deepest descendant (0 for a leaf) */
export function subtreeDepth(block: PageBlock): number {
  const kids = getChildren(block);
  if (!kids.length) return 0;
  return 1 + Math.max(...kids.map(subtreeDepth));
}

export const MAX_NESTING_DEPTH = 4;

/**
 * Can a block of `type` (optionally an existing block being moved) be placed
 * inside `parentId`? Checks container rules, allowed children/parents,
 * self/descendant drops and maximum depth.
 */
export function canDrop(
  blocks: PageBlock[],
  type: string,
  parentId: string | null,
  movingId?: string
): boolean {
  if (movingId && parentId && (movingId === parentId || isDescendant(blocks, movingId, parentId))) {
    return false;
  }
  const childDef = getBlockDefinition(type);
  if (!childDef) return false;
  if (parentId === null) {
    return !childDef.nesting?.allowedParents?.length;
  }
  const parentLoc = findBlock(blocks, parentId);
  if (!parentLoc) return false;
  const parentDef = getBlockDefinition(parentLoc.block.type);
  const rules = parentDef?.nesting;
  if (!rules?.canHaveChildren) return false;
  if (rules.allowedChildren?.length && !rules.allowedChildren.includes(type)) return false;
  if (childDef.nesting?.allowedParents?.length && !childDef.nesting.allowedParents.includes(parentLoc.block.type)) {
    return false;
  }
  const moving = movingId ? findBlock(blocks, movingId)?.block : undefined;
  const extra = moving ? subtreeDepth(moving) : 0;
  const maxDepth = Math.min(rules.maxDepth ?? MAX_NESTING_DEPTH, MAX_NESTING_DEPTH);
  return parentLoc.depth + 1 + extra <= maxDepth;
}

/**
 * Move `id` to `parentId` at `index` (index is interpreted in the target
 * sibling list *before* removal, as computed from the drop indicator).
 */
export function moveBlock(
  blocks: PageBlock[],
  id: string,
  parentId: string | null,
  index: number
): PageBlock[] {
  const loc = findBlock(blocks, id);
  if (!loc) return blocks;
  if (!canDrop(blocks, loc.block.type, parentId, id)) return blocks;
  let target = index;
  if (loc.parentId === parentId && loc.index < index) target -= 1;
  if (loc.parentId === parentId && loc.index === target) return blocks;
  const without = removeBlock(blocks, id);
  return insertBlocks(without, parentId, target, [loc.block]);
}

/** Flatten for navigator / search */
export function flatten(
  blocks: PageBlock[],
  depth = 0,
  parentId: string | null = null
): Array<{ block: PageBlock; depth: number; parentId: string | null; index: number }> {
  const out: Array<{ block: PageBlock; depth: number; parentId: string | null; index: number }> = [];
  blocks.forEach((b, index) => {
    out.push({ block: b, depth, parentId, index });
    out.push(...flatten(getChildren(b), depth + 1, b.id));
  });
  return out;
}
