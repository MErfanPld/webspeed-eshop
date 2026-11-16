"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  /** Real device width in CSS pixels (390 / 768 / 1280…) */
  width: number;
  /** Edit mode adds `ws-builder-edit` to <html> (hidden blocks stay visible, faded) */
  editMode: boolean;
  onHeightChange: (h: number) => void;
  /** Called with the iframe document once ready (for keyboard shortcuts) */
  onDocument?: (doc: Document | null) => void;
  children: ReactNode;
  title?: string;
};

const CLONED_ATTR = "data-ws-cloned";

/**
 * Real responsive preview.
 * The page renders inside a same-origin iframe through a React portal, so
 * the iframe has its own viewport: Tailwind breakpoints (sm/md/lg) and the
 * `ws-*` media queries respond to the *device* width, exactly like on a
 * phone. React context (cart, catalog, builder store) still flows through
 * the portal because it is the same React tree.
 */
export default function CanvasFrame({
  width,
  editMode,
  onHeightChange,
  onDocument,
  children,
  title = "پیش‌نمایش صفحه",
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const heightCb = useRef(onHeightChange);
  heightCb.current = onHeightChange;
  const docCb = useRef(onDocument);
  docCb.current = onDocument;

  // Build the iframe document and mirror the parent's stylesheets into it
  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!iframe || !doc) return;

    doc.open();
    doc.write(
      '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8" />' +
        '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
        "<style>html,body{margin:0;overflow:hidden;background:#fff}" +
        /* never let viewport-height utilities feed back into the auto height */
        ".min-h-screen,.min-h-\\[100dvh\\]{min-height:auto!important}" +
        ".h-screen,.h-\\[100dvh\\]{height:auto!important}</style>" +
        '</head><body><div id="ws-canvas-root"></div></body></html>'
    );
    doc.close();
    doc.body.className = document.body.className;

    // Mirror the parent's stylesheets incrementally. Removing and re-adding all
    // of them on every change left the canvas unstyled for a frame (content
    // collapsed and the page "shook" whenever Next.js injected CSS — often in dev).
    const clones = new Map<Node, HTMLElement>();
    let raf = 0;
    const syncStyles = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const current = Array.from(document.head.querySelectorAll<HTMLElement>('style, link[rel="stylesheet"]'));
        const alive = new Set<Node>(current);
        clones.forEach((clone, original) => {
          if (!alive.has(original)) {
            clone.remove();
            clones.delete(original);
          }
        });
        let prev: HTMLElement | null = null;
        for (const node of current) {
          let clone = clones.get(node);
          if (!clone) {
            clone = node.cloneNode(true) as HTMLElement;
            clone.setAttribute(CLONED_ATTR, "");
            clones.set(node, clone);
          } else if (node.tagName === "STYLE" && clone.textContent !== node.textContent) {
            clone.textContent = node.textContent; // dev: style text updated in place
          } else if (node.tagName === "LINK" && clone.getAttribute("href") !== node.getAttribute("href")) {
            clone.setAttribute("href", node.getAttribute("href") || "");
          }
          // keep cascade order without detaching existing sheets
          // (clones stay after the frame's own base styles, as before)
          const want: ChildNode | null = prev ? prev.nextSibling : doc.head.querySelector(`[${CLONED_ATTR}]`);
          if (clone !== want) {
            if (want) doc.head.insertBefore(clone, want);
            else doc.head.appendChild(clone);
          }
          prev = clone;
        }
      });
    };
    syncStyles();
    const mo = new MutationObserver(syncStyles);
    mo.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["href"] });

    const root = doc.getElementById("ws-canvas-root")!;
    const win = iframe.contentWindow as (Window & typeof globalThis) | null;
    const RO = win?.ResizeObserver ?? ResizeObserver;
    const ro = new RO(() => heightCb.current(Math.ceil(root.getBoundingClientRect().height)));
    ro.observe(root);

    setMountNode(root);
    docCb.current?.(doc);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      ro.disconnect();
      docCb.current?.(null);
      setMountNode(null);
    };
  }, []);

  useEffect(() => {
    const html = iframeRef.current?.contentDocument?.documentElement;
    html?.classList.toggle("ws-builder-edit", editMode);
  }, [editMode, mountNode]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title={title}
        data-builder-frame
        className="block border-0 bg-white"
        style={{ width, height: "100%" }}
      />
      {mountNode && createPortal(children, mountNode)}
    </>
  );
}
