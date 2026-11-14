import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ManagedPage } from "@/builder/contracts/page-contract";

const pages = new Map<string, ManagedPage>();

vi.mock("@/builder/repositories", () => ({
  pageRepository: {
    getPage: async (id: string) => structuredClone(pages.get(id) ?? null),
    savePage: async (p: ManagedPage) => {
      if (p.slug === "/boom") throw new Error("آدرس نامعتبر است");
      pages.set(p.id, structuredClone(p));
      return structuredClone(p);
    },
    publishPage: async (id: string) => {
      const p = pages.get(id)!;
      const next = { ...p, status: "published" as const, publishedBlocks: structuredClone(p.blocks) };
      pages.set(id, next);
      return structuredClone(next);
    },
    unpublishPage: async (id: string) => {
      const p = pages.get(id)!;
      const next = { ...p, status: "draft" as const, publishedBlocks: [] };
      pages.set(id, next);
      return structuredClone(next);
    },
  },
}));

const { builderActions: a, getBuilderState: s, resetBuilderStore } = await import("@/builder/store/builder-store");
const tree = await import("@/builder/store/tree");

function seed(): ManagedPage {
  return {
    schemaVersion: 1,
    id: "p",
    name: "Test",
    slug: "/p",
    type: "custom",
    status: "draft",
    createdAt: "",
    updatedAt: "",
    blocks: [],
  };
}

beforeEach(async () => {
  pages.clear();
  pages.set("p", seed());
  resetBuilderStore();
  await a.loadPage("p");
});

describe("builder store", () => {
  it("adds blocks after the selection and inside selected containers", () => {
    a.addBlock("heading");
    const h = s().selectedBlockId!;
    a.addBlock("columns");
    const cols = s().selectedBlockId!;
    expect(s().blocks.map((b) => b.type)).toEqual(["heading", "columns"]);
    a.addBlock("text"); // columns selected → goes inside
    expect(tree.findBlock(s().blocks, s().selectedBlockId!)?.parentId).toBe(cols);
    a.selectBlock(h);
    a.addBlock("button");
    expect(s().blocks.map((b) => b.type)).toEqual(["heading", "button", "columns"]);
  });

  it("coalesces rapid edits of one field into a single undo step", () => {
    a.addBlock("heading");
    const id = s().selectedBlockId!;
    const before = s().past.length;
    for (const v of ["س", "سل", "سلا", "سلام"]) a.updateBlockData(id, "text", v);
    expect(s().past.length).toBe(before + 1);
    a.undo();
    expect(tree.findBlock(s().blocks, id)?.block.data.text).toBe("عنوان بخش");
    a.redo();
    expect(tree.findBlock(s().blocks, id)?.block.data.text).toBe("سلام");
  });

  it("undoes page meta changes", () => {
    a.updatePageMeta({ name: "نام جدید" });
    expect(s().page?.name).toBe("نام جدید");
    a.undo();
    expect(s().page?.name).toBe("Test");
  });

  it("locked blocks cannot be edited, moved or removed", () => {
    a.addBlock("text");
    const id = s().selectedBlockId!;
    a.setBlockLocked(id, true);
    a.updateBlockData(id, "text", "x");
    a.removeBlock(id);
    expect(tree.findBlock(s().blocks, id)?.block.data.text).toBe("متن خود را اینجا بنویسید.");
    a.setBlockLocked(id, false);
    a.removeBlock(id);
    expect(s().blocks).toHaveLength(0);
  });

  it("copy/paste and duplicate create fresh ids for nested content", () => {
    a.addBlock("faq");
    const id = s().selectedBlockId!;
    a.copyBlock();
    a.pasteBlock();
    a.duplicateBlock(id);
    const ids = s().blocks.flatMap((b) => [b.id, ...(b.data.items as { id: string }[]).map((i) => i.id)]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(s().blocks).toHaveLength(3);
  });

  it("moves blocks into containers via moveBlockTo", () => {
    a.addBlock("text");
    const t = s().selectedBlockId!;
    a.clearSelection();
    a.addBlock("section");
    const sec = s().selectedBlockId!;
    a.moveBlockTo(t, sec, 0);
    expect(tree.findBlock(s().blocks, t)?.parentId).toBe(sec);
  });

  it("saves drafts and reports errors without losing dirty state", async () => {
    a.addBlock("text");
    await a.saveDraft();
    expect(s().saveStatus).toBe("saved");
    expect(pages.get("p")!.blocks).toHaveLength(1);
    a.updatePageMeta({ slug: "/boom" });
    await a.saveDraft();
    expect(s().saveStatus).toBe("error");
    expect(s().saveError).toContain("نامعتبر");
    expect(s().isDirty).toBe(true);
  });

  it("publish snapshots blocks; unpublish keeps pending edits", async () => {
    a.addBlock("text");
    await a.publish();
    expect(pages.get("p")!.publishedBlocks).toHaveLength(1);
    a.addBlock("heading");
    await a.unpublish();
    expect(pages.get("p")!.blocks).toHaveLength(2);
    expect(pages.get("p")!.status).toBe("draft");
  });
});
