"use client";

/**
 * Shared page renderer for Builder Preview and Storefront.
 * Uses the same BlockRenderer + existing block views — no duplicates.
 */
import { BlockRenderer } from "@/builder/BlockRenderer";
import type { PageBlock } from "@/builder/types";

export function PageRenderer({ blocks }: { blocks: PageBlock[] }) {
  if (!blocks?.length) return null;

  return (
    <div className="flex flex-col gap-0">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

export default PageRenderer;
