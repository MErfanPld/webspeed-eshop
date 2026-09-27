"use client";

import type { PageBlock } from "@/builder/types";
import { BlockRenderer } from "@/builder/BlockRenderer";

type Props = { block: PageBlock };

function childrenOf(block: PageBlock): PageBlock[] {
  const data = (block as { data?: { children?: PageBlock[] } }).data;
  return Array.isArray(data?.children) ? data!.children! : [];
}

export function SectionBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const padY = Number(d.paddingY ?? 48);
  const bg = String(d.background ?? "transparent");
  return (
    <section
      className="w-full"
      style={{
        paddingTop: padY,
        paddingBottom: padY,
        background: bg === "transparent" ? undefined : bg,
      }}
    >
      {childrenOf(block).map((c) => (
        <BlockRenderer key={c.id} block={c} />
      ))}
    </section>
  );
}

export function ContainerBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const maxW = Number(d.maxWidth ?? 1280);
  return (
    <div className="mx-auto w-full px-4 sm:px-6" style={{ maxWidth: maxW }}>
      {childrenOf(block).map((c) => (
        <BlockRenderer key={c.id} block={c} />
      ))}
    </div>
  );
}

export function ColumnsBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const cols = Number(d.columns ?? 2);
  const gap = Number(d.gap ?? 24);
  return (
    <div
      className="grid w-full"
      style={{
        gridTemplateColumns: `repeat(${Math.min(Math.max(cols, 1), 6)}, minmax(0, 1fr))`,
        gap,
      }}
    >
      {childrenOf(block).map((c) => (
        <BlockRenderer key={c.id} block={c} />
      ))}
    </div>
  );
}

export function SpacerBlock({ block }: Props) {
  const h = Number((block as { data?: { height?: number } }).data?.height ?? 32);
  return <div style={{ height: h }} aria-hidden />;
}

export function DividerBlock({ block }: Props) {
  const d = (block as { data?: { color?: string; thickness?: number } }).data || {};
  return (
    <hr
      className="w-full border-0"
      style={{
        height: Number(d.thickness ?? 1),
        background: String(d.color ?? "#e2e8f0"),
      }}
    />
  );
}

export function StackBlock({ block }: Props) {
  const gap = Number((block as { data?: { gap?: number } }).data?.gap ?? 16);
  return (
    <div className="flex flex-col w-full" style={{ gap }}>
      {childrenOf(block).map((c) => (
        <BlockRenderer key={c.id} block={c} />
      ))}
    </div>
  );
}
