"use client";

import type { PageBlock } from "@/builder/types";
import { BlockChildren } from "@/builder/rendering/BlockChildren";
import { combineResponsive, responsiveProp } from "@/builder/responsive/css";
import { cn } from "@/lib/utils";

type Props = { block: PageBlock };

function dataOf(block: PageBlock): Record<string, unknown> {
  return ((block as { data?: Record<string, unknown> }).data || {}) as Record<string, unknown>;
}

function clampColumns(value: unknown): unknown {
  const clamp = (n: unknown) =>
    typeof n === "number" ? Math.min(Math.max(Math.round(n), 1), 6) : n;
  if (value && typeof value === "object") {
    const r = value as Record<string, unknown>;
    return { desktop: clamp(r.desktop), tablet: clamp(r.tablet), mobile: clamp(r.mobile) };
  }
  return clamp(value);
}

export function SectionBlock({ block }: Props) {
  const d = dataOf(block);
  const r = combineResponsive(responsiveProp("py", d.paddingY, { fallback: 48 }));
  const bg = String(d.background ?? "transparent");
  return (
    <section
      className={cn("w-full", r.className)}
      style={{ ...r.style, background: bg === "transparent" ? undefined : bg }}
    >
      <BlockChildren parent={block} />
    </section>
  );
}

export function ContainerBlock({ block }: Props) {
  const d = dataOf(block);
  const r = combineResponsive(responsiveProp("maxw", d.maxWidth, { fallback: 1280 }));
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6", r.className)} style={r.style}>
      <BlockChildren parent={block} />
    </div>
  );
}

/** Columns collapse to 2 on tablet and 1 on mobile unless set explicitly */
function GridLike({ block, defaultCols }: Props & { defaultCols: number }) {
  const d = dataOf(block);
  const r = combineResponsive(
    responsiveProp("cols", clampColumns(d.columns), {
      unit: "",
      fallback: defaultCols,
      tabletFallback: Math.min(defaultCols, 2),
      mobileFallback: 1,
    }),
    responsiveProp("gap", d.gap, { fallback: 24 })
  );
  return (
    <div className={cn("grid w-full px-4 sm:px-6", r.className)} style={r.style}>
      <BlockChildren parent={block} />
    </div>
  );
}

export function ColumnsBlock({ block }: Props) {
  return <GridLike block={block} defaultCols={2} />;
}

export function GridBlock({ block }: Props) {
  return <GridLike block={block} defaultCols={3} />;
}

export function StackBlock({ block }: Props) {
  const d = dataOf(block);
  const r = combineResponsive(responsiveProp("gap", d.gap, { fallback: 16 }));
  return (
    <div className={cn("flex flex-col w-full px-4 sm:px-6", r.className)} style={r.style}>
      <BlockChildren parent={block} />
    </div>
  );
}

const JUSTIFY = new Set(["flex-start", "center", "flex-end", "space-between"]);
const ALIGN = new Set(["flex-start", "center", "flex-end", "stretch"]);

export function FlexBlock({ block }: Props) {
  const d = dataOf(block);
  const r = combineResponsive(responsiveProp("gap", d.gap, { fallback: 16 }));
  const justify = JUSTIFY.has(String(d.justify)) ? String(d.justify) : "flex-start";
  const align = ALIGN.has(String(d.align)) ? String(d.align) : "center";
  return (
    <div
      className={cn("w-full px-4 sm:px-6 py-4 flex flex-wrap", r.className)}
      style={{ ...r.style, justifyContent: justify, alignItems: align }}
    >
      <BlockChildren parent={block} />
    </div>
  );
}

export function SpacerBlock({ block }: Props) {
  const d = dataOf(block);
  const r = combineResponsive(responsiveProp("h", d.height, { fallback: 32 }));
  return <div className={r.className} style={r.style} aria-hidden />;
}

export function DividerBlock({ block }: Props) {
  const d = dataOf(block);
  const thickness = Math.min(Math.max(Number(d.thickness ?? 1) || 1, 1), 12);
  return (
    <div className="w-full px-4 sm:px-6">
      <hr
        className="w-full border-0"
        style={{ height: thickness, background: String(d.color ?? "#e2e8f0") }}
      />
    </div>
  );
}
