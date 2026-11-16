/**
 * Touch / pen drag & drop for the builder.
 *
 * HTML5 drag events don't fire for touch input, so on touch devices a
 * long press (300 ms) on a library item or a canvas block starts a
 * pointer-driven drag that reuses the same drop-target logic:
 * the element under the finger is resolved in the parent document or,
 * over the canvas, inside the same-origin iframe.
 */
import { beginDrag, cancelDrag, commitDrop, computeDropTarget, computeZoneTarget, currentBlocks, type DragPayload } from "./drag-state";
import { builderActions } from "@/builder/store/builder-store";

const HOLD_MS = 300;
const MOVE_TOLERANCE = 10;

/** Canvas iframe position and CSS scale (the preview is zoomed to fit) */
function frameGeometry() {
  const frame = document.querySelector<HTMLIFrameElement>("iframe");
  if (!frame) return null;
  const r = frame.getBoundingClientRect();
  const scale = frame.offsetWidth > 0 ? r.width / frame.offsetWidth : 1;
  return { frame, left: r.left, top: r.top, scale: scale || 1 };
}

/** Element under a top-document point, with y in that element's document */
function elementAt(x: number, y: number): { el: Element; y: number } | null {
  const el = document.elementFromPoint(x, y);
  if (el instanceof HTMLIFrameElement && el.contentDocument) {
    const g = frameGeometry();
    if (!g) return null;
    const ix = (x - g.left) / g.scale;
    const iy = (y - g.top) / g.scale;
    const inner = el.contentDocument.elementFromPoint(ix, iy);
    return inner ? { el: inner, y: iy } : null;
  }
  return el ? { el, y } : null;
}

function targetAt(x: number, y: number) {
  const hit = elementAt(x, y);
  if (!hit) return null;
  const el = hit.el;
  const blocks = currentBlocks();
  const zone = el.closest<HTMLElement>("[data-drop-zone]");
  const block = el.closest<HTMLElement>("[data-block-id]");
  if (zone && (!block || block.contains(zone))) {
    return computeZoneTarget(blocks, zone.dataset.dropZone || null);
  }
  if (!block?.dataset.blockId) return null;
  return computeDropTarget(blocks, block.dataset.blockId, block.getBoundingClientRect(), hit.y);
}

function ghost(label: string): HTMLElement {
  const g = document.createElement("div");
  g.textContent = label;
  g.setAttribute("aria-hidden", "true");
  Object.assign(g.style, {
    position: "fixed",
    zIndex: "9999",
    pointerEvents: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    background: "#111",
    color: "#fff",
    fontSize: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,.2)",
    transform: "translate(-50%, -140%)",
  });
  document.body.appendChild(g);
  return g;
}

/**
 * onPointerDown handler. Mouse input is ignored (HTML5 DnD handles it).
 * Returns nothing; the drag ends on pointerup / pointercancel.
 */
export function touchDragStart(e: React.PointerEvent, payload: DragPayload, label: string) {
  if (e.pointerType === "mouse") return;
  let active = false;
  let g: HTMLElement | null = null;
  const win = e.currentTarget.ownerDocument.defaultView ?? window;

  const timer = window.setTimeout(() => {
    active = true;
    beginDrag(payload);
    g = ghost(label);
    g.style.left = `${startX}px`;
    g.style.top = `${startY}px`;
    navigator.vibrate?.(15);
  }, HOLD_MS);

  // Events from inside the (scaled) iframe are in its coordinates; convert to the top document
  const toTop = (ev: { clientX: number; clientY: number }, fromFrame: boolean) => {
    const g = fromFrame ? frameGeometry() : null;
    if (!g) return { x: ev.clientX, y: ev.clientY };
    return { x: g.left + ev.clientX * g.scale, y: g.top + ev.clientY * g.scale };
  };
  const start = toTop(e, win !== window);
  const startX = start.x;
  const startY = start.y;

  const onMoveIn = (fromFrame: boolean) => (ev: PointerEvent) => {
    const { x, y } = toTop(ev, fromFrame);
    if (!active) {
      if (Math.hypot(x - startX, y - startY) > MOVE_TOLERANCE) cleanup(); // a scroll, not a drag
      return;
    }
    if (g) {
      g.style.left = `${x}px`;
      g.style.top = `${y}px`;
    }
    builderActions.setDropTarget(targetAt(x, y));
  };
  const preventScroll = (ev: TouchEvent) => {
    if (active) ev.preventDefault();
  };
  const onUp = () => {
    if (active) commitDrop();
    cleanup();
  };
  const onCancel = () => {
    if (active) cancelDrag();
    cleanup();
  };
  const onMoveTop = onMoveIn(false);
  const onMoveFrame = onMoveIn(true);
  const moveFor = (w: Window) => (w === window ? onMoveTop : onMoveFrame);
  function cleanup() {
    window.clearTimeout(timer);
    g?.remove();
    for (const w of new Set([win, window])) {
      w.removeEventListener("pointermove", moveFor(w));
      w.removeEventListener("pointerup", onUp);
      w.removeEventListener("pointercancel", onCancel);
      w.removeEventListener("touchmove", preventScroll);
    }
  }
  for (const w of new Set([win, window])) {
    w.addEventListener("pointermove", moveFor(w));
    w.addEventListener("pointerup", onUp);
    w.addEventListener("pointercancel", onCancel);
    w.addEventListener("touchmove", preventScroll, { passive: false });
  }
}
