"use client";

import type { PageBlock } from "./types";
import { getBlockComponent } from "@/builder/registry/block-components";
import type { VisibilitySettings } from "@/builder/responsive/types";
import {
  combineResponsive,
  responsiveProp,
  visibilityClasses,
} from "@/builder/responsive/css";
import { cn } from "@/lib/utils";

type BlockStyle = {
  marginTop?: unknown;
  marginBottom?: unknown;
  background?: string;
};

function sanitizeAnchor(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim().replace(/[^a-zA-Z0-9_\-؀-ۿ]/g, "-");
  return s || undefined;
}

/**
 * Renders one block with the common wrapper used by both the storefront
 * and the builder canvas:
 *  - `enabled: false` → not rendered
 *  - per-device visibility → CSS media-query classes (works on storefront)
 *  - common `_style` (responsive margins, background) and `_anchor`
 */
export function BlockRenderer({ block }: { block: PageBlock }) {
  if (block.enabled === false) return null;
  const data = ((block as { data?: Record<string, unknown> }).data || {}) as Record<
    string,
    unknown
  >;
  const View = getBlockComponent(block.type);
  if (!View) {
    return (
      <div className="m-2 rounded-lg border border-dashed border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
        بلوک ناشناخته: <code className="font-mono">{block.type}</code>
      </div>
    );
  }

  const vis = data._visibility as Partial<VisibilitySettings> | undefined;
  const style = (data._style as BlockStyle | undefined) || {};
  const responsive = combineResponsive(
    responsiveProp("mt", style.marginTop),
    responsiveProp("mb", style.marginBottom)
  );
  const background =
    typeof style.background === "string" && style.background && style.background !== "transparent"
      ? style.background
      : undefined;

  return (
    <div
      id={sanitizeAnchor(data._anchor)}
      data-ws-block={block.type}
      className={cn("ws-block min-w-0", visibilityClasses(vis), responsive.className)}
      style={{ ...responsive.style, background }}
    >
      <View block={block} />
    </div>
  );
}

export default BlockRenderer;
