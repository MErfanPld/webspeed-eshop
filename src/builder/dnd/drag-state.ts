/**
 * Shared drag & drop state.
 * HTML5 drag events cannot carry rich data during `dragover` (only types),
 * and the canvas lives in an iframe. Both documents run in the same JS
 * realm, so the active drag is kept in a module variable.
 */
import type { DropTarget } from "@/builder/store/builder-store";
import { builderActions, getBuilderState } from "@/builder/store/builder-store";
import * as tree from "@/builder/store/tree";
import type { PageBlock } from "@/builder/types";

export type DragPayload =
  | { kind: "new"; type: string }
  | { kind: "move"; id: string; type: string };

let current: DragPayload | null = null;

export const DRAG_MIME = "application/x-webspeed-block";

export function startDrag(e: DragEvent | React.DragEvent, payload: DragPayload) {
  current = payload;
  const dt = e.dataTransfer;
  if (dt) {
    dt.effectAllowed = payload.kind === "new" ? "copy" : "move";
    // Firefox requires some data to start a drag
    dt.setData("text/plain", payload.kind === "new" ? payload.type : payload.id);
    try {
      dt.setData(DRAG_MIME, JSON.stringify(payload));
    } catch {
      /* some browsers restrict custom types */
    }
  }
}

/** Start a drag without an HTML5 DragEvent (touch / pen, see touch-drag.ts) */
export function beginDrag(payload: DragPayload) {
  current = payload;
}

export function getDrag(): DragPayload | null {
  return current;
}

export function endDrag() {
  current = null;
}

/**
 * Compute a drop target from the pointer position over a block element.
 * - Container blocks: middle 50% of the height drops *inside* (append)
 * - Otherwise top half → before, bottom half → after
 */
export function computeDropTarget(
  blocks: PageBlock[],
  overBlockId: string,
  rect: { top: number; height: number },
  clientY: number
): DropTarget | null {
  const drag = current;
  if (!drag) return null;
  const loc = tree.findBlock(blocks, overBlockId);
  if (!loc) return null;
  const movingId = drag.kind === "move" ? drag.id : undefined;
  if (movingId && (movingId === overBlockId || tree.isDescendant(blocks, movingId, overBlockId))) return null;

  const rel = rect.height > 0 ? (clientY - rect.top) / rect.height : 0.5;
  if (tree.isContainer(loc.block) && rel > 0.25 && rel < 0.75 && tree.canDrop(blocks, drag.type, loc.block.id, movingId)) {
    return {
      parentId: loc.block.id,
      index: tree.getChildren(loc.block).length,
      anchorId: loc.block.id,
      position: "inside",
    };
  }
  const position = rel < 0.5 ? "before" : "after";
  if (!tree.canDrop(blocks, drag.type, loc.parentId, movingId)) return null;
  return {
    parentId: loc.parentId,
    index: position === "before" ? loc.index : loc.index + 1,
    anchorId: loc.block.id,
    position,
  };
}

/** Target for an empty container / empty canvas drop zone */
export function computeZoneTarget(blocks: PageBlock[], parentId: string | null): DropTarget | null {
  const drag = current;
  if (!drag) return null;
  const movingId = drag.kind === "move" ? drag.id : undefined;
  if (!tree.canDrop(blocks, drag.type, parentId, movingId)) return null;
  const siblings = tree.getSiblings(blocks, parentId);
  return { parentId, index: siblings.length, anchorId: parentId, position: "inside" };
}

export function currentBlocks(): PageBlock[] {
  return getBuilderState().blocks;
}

/** Apply the current drop target. Returns true when something changed. */
export function commitDrop(): boolean {
  const drag = current;
  const target = getBuilderState().dropTarget;
  current = null;
  builderActions.setDropTarget(null);
  if (!drag || !target) return false;
  if (drag.kind === "new") {
    builderActions.addBlock(drag.type, { parentId: target.parentId, index: target.index });
  } else {
    builderActions.moveBlockTo(drag.id, target.parentId, target.index);
  }
  return true;
}

export function cancelDrag() {
  current = null;
  builderActions.setDropTarget(null);
}
