import { describe, expect, it } from "vitest";
import { migratePage, validatePage } from "@/builder/validation/page-schema";

const base = {
  schemaVersion: 1,
  id: "p1",
  name: "صفحه",
  slug: "/p1",
  type: "custom",
  status: "draft",
  blocks: [{ id: "b1", type: "text", data: { text: "سلام" } }],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("validatePage", () => {
  it("keeps SEO fields (regression: seo was dropped)", () => {
    const r = validatePage({ ...base, seo: { title: "عنوان", description: "توضیح", junk: 1 } });
    expect(r.ok && r.data.seo).toEqual({ title: "عنوان", description: "توضیح" });
  });

  it("rejects non-serializable block data", () => {
    const r = validatePage({ ...base, blocks: [{ id: "b", type: "text", data: { fn: () => 1 } }] });
    expect(r.ok).toBe(false);
  });

  it("rejects invalid status and type", () => {
    expect(validatePage({ ...base, status: "live" }).ok).toBe(false);
    expect(validatePage({ ...base, type: "weird" }).ok).toBe(false);
  });

  it("accepts global layout document types", () => {
    expect(validatePage({ ...base, type: "header" }).ok).toBe(true);
    expect(validatePage({ ...base, type: "footer" }).ok).toBe(true);
  });
});

describe("migratePage", () => {
  it("upgrades a v0 document with defaults", () => {
    const r = migratePage({ id: "old", blocks: [] });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data).toMatchObject({ schemaVersion: 1, status: "draft", type: "custom", slug: "/old" });
    }
  });
});
