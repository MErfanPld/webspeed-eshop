"use client";

/**
 * Shared page renderer for Builder Preview and Storefront.
 * A failing block is isolated (rendered as nothing) so one bad block
 * never takes the whole page down.
 */
import { BlockRenderer } from "@/builder/BlockRenderer";
import BlockErrorBoundary from "@/builder/components/BlockErrorBoundary";
import type { PageBlock } from "@/builder/types";

export function PageRenderer({ blocks }: { blocks: PageBlock[] }) {
  if (!blocks?.length) return null;

  return (
    <div className="flex flex-col gap-0">
      {blocks.map((block) => (
        <BlockErrorBoundary key={block.id} blockId={block.id} blockType={block.type} silent>
          <BlockRenderer block={block} />
        </BlockErrorBoundary>
      ))}
    </div>
  );
}

export default PageRenderer;
