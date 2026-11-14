import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ws-pages-"));
process.env.DATA_DIR = dir;

const { pageService } = await import("@/server/services/pages");
const { storeService } = await import("@/server/services/stores");
const { getDb } = await import("@/server/db");

let storeId = "";

beforeAll(() => {
  getDb();
  storeId = storeService.list()[0].id;
});

afterAll(() => {
  getDb().close();
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("page service (SQLite)", () => {
  it("seeds home, global header/footer and content pages", () => {
    const ids = pageService.list(storeId).map((p) => p.id);
    expect(ids).toEqual(expect.arrayContaining(["home", "site-header", "site-footer", "about", "contact"]));
    expect(pageService.getPublished(storeId, "home")?.publishedBlocks?.length).toBeGreaterThan(0);
  });

  it("creates pages with validated, unique slugs", () => {
    const p = pageService.create(storeId, { name: "حراج", slug: "/sale" });
    expect(p.slug).toBe("/sale");
    expect(() => pageService.create(storeId, { name: "x", slug: "/sale" })).toThrow(/قبلاً/);
    expect(() => pageService.create(storeId, { name: "x", slug: "/admin/x" })).toThrow(/سیستمی/);
    expect(() => pageService.create(storeId, { name: "", slug: "/y" })).toThrow(/الزامی/);
  });

  it("keeps SEO, rejects unknown block types and strips unsafe URLs", () => {
    const p = pageService.create(storeId, { name: "seo", slug: "/seo" });
    const saved = pageService.save(storeId, {
      ...p,
      seo: { title: "T" },
      blocks: [{ id: "b", type: "button", data: { label: "x", href: "javascript:alert(1)" } }],
    });
    expect(saved.seo).toEqual({ title: "T" });
    expect(saved.blocks[0].data.href).toBe("#");
    expect(() => pageService.save(storeId, { ...p, blocks: [{ id: "z", type: "evil", data: {} }] })).toThrow(/ناشناخته/);
  });

  it("saving a draft never changes the published snapshot", () => {
    const p = pageService.create(storeId, { name: "pub", slug: "/pub" });
    pageService.save(storeId, { ...p, blocks: [{ id: "t", type: "text", data: { text: "v1" } }] });
    pageService.publish(storeId, p.id);
    const draft = pageService.get(storeId, p.id)!;
    pageService.save(storeId, { ...draft, status: "draft", publishedBlocks: [], blocks: [{ id: "t", type: "text", data: { text: "v2" } }] });
    const pub = pageService.getPublishedBySlug(storeId, "/pub")!;
    expect(pub.publishedBlocks?.[0].data.text).toBe("v1");
    expect(pub.status).toBe("published");
    pageService.unpublish(storeId, p.id);
    expect(pageService.getPublishedBySlug(storeId, "/pub")).toBeNull();
  });

  it("duplicates with a unique slug and protects system pages", () => {
    const a = pageService.duplicate(storeId, "home");
    const b = pageService.duplicate(storeId, "home");
    expect(a.slug).toBe("/home-copy");
    expect(b.slug).toBe("/home-copy-2");
    expect(a.type).toBe("landing");
    expect(() => pageService.delete(storeId, "home")).toThrow();
    expect(() => pageService.duplicate(storeId, "site-header")).toThrow();
  });

  it("never serves layout documents as routable pages", () => {
    pageService.publish(storeId, "site-header");
    expect(pageService.getPublishedBySlug(storeId, "/_layout/header")).toBeNull();
  });

  it("isolates pages per store", () => {
    const owner = getDb().prepare("SELECT user_id FROM store_members LIMIT 1").get() as { user_id: string };
    const other = storeService.create({ name: "دوم", slug: "second", ownerId: owner.user_id });
    expect(pageService.get(other.id, "home")).not.toBeNull();
    pageService.create(other.id, { name: "only", slug: "/only-here" });
    expect(pageService.getPublishedBySlug(storeId, "/only-here")).toBeNull();
    expect(pageService.list(storeId).some((p) => p.slug === "/only-here")).toBe(false);
  });
});
