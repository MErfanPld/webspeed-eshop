import { describe, expect, it } from "vitest";
import * as tree from "@/builder/store/tree";
import type { PageBlock } from "@/builder/types";

const b = (id: string, type: string, children?: PageBlock[]): PageBlock => ({
  id,
  type,
  data: children ? { children } : {},
});

function sample(): PageBlock[] {
  return [
    b("hero", "hero"),
    b("sec", "section", [b("cols", "columns", [b("h1", "heading"), b("t1", "text")])]),
    b("faq", "faq"),
  ];
}

describe("tree helpers", () => {
  it("finds nested blocks with parent, index and depth", () => {
    const loc = tree.findBlock(sample(), "t1");
    expect(loc).toMatchObject({ parentId: "cols", index: 1, depth: 2 });
  });

  it("inserts into a container without mutating the input", () => {
    const input = sample();
    const frozen = JSON.stringify(input);
    const next = tree.insertBlocks(input, "cols", 0, [b("x", "button")]);
    expect(JSON.stringify(input)).toBe(frozen);
    expect(tree.findBlock(next, "x")).toMatchObject({ parentId: "cols", index: 0 });
  });

  it("removes nested blocks", () => {
    const next = tree.removeBlock(sample(), "h1");
    expect(tree.findBlock(next, "h1")).toBeNull();
    expect(tree.getChildren(tree.findBlock(next, "cols")!.block)).toHaveLength(1);
  });

  it("moves between parents, adjusting the index within the same list", () => {
    let next = tree.moveBlock(sample(), "faq", null, 0);
    expect(next.map((x) => x.id)).toEqual(["faq", "hero", "sec"]);
    // moving down inside the same list: index refers to the list before removal
    next = tree.moveBlock(sample(), "hero", null, 2);
    expect(next.map((x) => x.id)).toEqual(["sec", "hero", "faq"]);
    next = tree.moveBlock(sample(), "hero", "cols", 1);
    expect(tree.findBlock(next, "hero")).toMatchObject({ parentId: "cols", index: 1 });
  });

  it("refuses to drop a container into itself or its descendants", () => {
    const blocks = sample();
    expect(tree.canDrop(blocks, "section", "cols", "sec")).toBe(false);
    expect(tree.moveBlock(blocks, "sec", "cols", 0)).toBe(blocks);
  });

  it("refuses children in non-container blocks and unknown types", () => {
    expect(tree.canDrop(sample(), "text", "hero")).toBe(false);
    expect(tree.canDrop(sample(), "does-not-exist", null)).toBe(false);
  });

  it("enforces the maximum nesting depth", () => {
    // depth: section(0) > columns(1) > stack(2) > grid(3) > text(4) is allowed, deeper is not
    let blocks: PageBlock[] = [b("s", "section", [b("c", "columns", [b("st", "stack", [b("g", "grid", [])])])])];
    expect(tree.canDrop(blocks, "text", "g")).toBe(true);
    blocks = tree.insertBlocks(blocks, "g", 0, [b("f", "flex", [])]);
    expect(tree.canDrop(blocks, "text", "f")).toBe(false);
  });

  it("flattens in document order with depth", () => {
    expect(tree.flatten(sample()).map((x) => `${x.block.id}:${x.depth}`)).toEqual([
      "hero:0",
      "sec:0",
      "cols:1",
      "h1:2",
      "t1:2",
      "faq:0",
    ]);
  });
});
