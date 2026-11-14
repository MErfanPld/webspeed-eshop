"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PageBlock } from "@/builder/types";
import { BlockRenderer } from "@/builder/BlockRenderer";

/** Nested blocks are stored in `data.children` of container blocks */
export function childrenOf(block: PageBlock): PageBlock[] {
  const data = (block as { data?: { children?: unknown } }).data;
  return Array.isArray(data?.children) ? (data!.children as PageBlock[]) : [];
}

type ChildrenRenderer = (parent: PageBlock, children: PageBlock[]) => ReactNode;

/**
 * The builder canvas overrides how children are rendered (selection chrome,
 * drop zones). On the storefront there is no provider and children render
 * through the plain BlockRenderer.
 */
const ChildrenRendererContext = createContext<ChildrenRenderer | null>(null);

export const ChildrenRendererProvider = ChildrenRendererContext.Provider;

export function BlockChildren({ parent }: { parent: PageBlock }) {
  const custom = useContext(ChildrenRendererContext);
  const kids = childrenOf(parent);
  if (custom) return <>{custom(parent, kids)}</>;
  return (
    <>
      {kids.map((c) => (
        <BlockRenderer key={c.id} block={c} />
      ))}
    </>
  );
}
