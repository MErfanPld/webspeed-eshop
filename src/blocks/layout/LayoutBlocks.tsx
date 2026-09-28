"use client";

import type { PageBlock } from "@/builder/types";
import { BlockRenderer } from "@/builder/BlockRenderer";
import { usePreviewDevice } from "@/builder/responsive/device-context";
import {
  resolveResponsive,
  type ResponsiveValue,
} from "@/builder/responsive/types";

type Props = { block: PageBlock };

function childrenOf(block: PageBlock): PageBlock[] {
  const data = (block as { data?: { children?: PageBlock[] } }).data;
  return Array.isArray(data?.children) ? data!.children! : [];
}

function numResponsive(
  value: unknown,
  device: "desktop" | "tablet" | "mobile",
  fallback: number
): number {
  return resolveResponsive(
    value as ResponsiveValue<number> | number | undefined,
    device,
    fallback
  );
}

export function SectionBlock({ block }: Props) {
  const device = usePreviewDevice();
  const d = (block as { data: Record<string, unknown> }).data || {};
  const padY = numResponsive(d.paddingY, device, 48);
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
  const device = usePreviewDevice();
  const d = (block as { data: Record<string, unknown> }).data || {};
  let maxW = numResponsive(d.maxWidth, device, 1280);
  if (device === "mobile") maxW = Math.min(maxW, 390);
  if (device === "tablet") maxW = Math.min(maxW, 768);
  return (
    <div className="mx-auto w-full px-4 sm:px-6" style={{ maxWidth: maxW }}>
      {childrenOf(block).map((c) => (
        <BlockRenderer key={c.id} block={c} />
      ))}
    </div>
  );
}

export function ColumnsBlock({ block }: Props) {
  const device = usePreviewDevice();
  const d = (block as { data: Record<string, unknown> }).data || {};
  let cols = numResponsive(d.columns, device, 2);
  // Real responsive layout: collapse when only a single number is set
  if (typeof d.columns === "number" || d.columns == null) {
    if (device === "mobile") cols = 1;
    else if (device === "tablet") cols = Math.min(cols, 2);
  }
  const gap = numResponsive(d.gap, device, 24);
  return (
    <div
      className="grid w-full px-4 sm:px-6"
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

export function StackBlock({ block }: Props) {
  const device = usePreviewDevice();
  const d = (block as { data: Record<string, unknown> }).data || {};
  const gap = numResponsive(d.gap, device, 16);
  return (
    <div className="flex flex-col w-full px-4 sm:px-6" style={{ gap }}>
      {childrenOf(block).map((c) => (
        <BlockRenderer key={c.id} block={c} />
      ))}
    </div>
  );
}

export function SpacerBlock({ block }: Props) {
  const device = usePreviewDevice();
  const d = (block as { data?: Record<string, unknown> }).data || {};
  const h = numResponsive(d.height, device, 32);
  return <div style={{ height: h }} aria-hidden />;
}

export function DividerBlock({ block }: Props) {
  const d = (block as { data?: { color?: string; thickness?: number } }).data || {};
  return (
    <hr
      className="w-full border-0 mx-4 sm:mx-6"
      style={{
        height: Number(d.thickness ?? 1),
        background: String(d.color ?? "#e2e8f0"),
      }}
    />
  );
}
