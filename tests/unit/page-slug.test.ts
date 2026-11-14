import { describe, expect, it } from "vitest";
import { isReservedSlug, isValidSlug, normalizeSlug, slugFromName } from "@/lib/page-slug";

describe("page slugs", () => {
  it("normalizes input to a clean path", () => {
    expect(normalizeSlug(" About Us/ ")).toBe("/about-us");
    expect(normalizeSlug("a//b")).toBe("/a/b");
    expect(normalizeSlug("")).toBe("/");
  });

  it("supports Persian slugs", () => {
    expect(isValidSlug("/درباره-ما")).toBe(true);
    expect(slugFromName("درباره ما")).toBe("/درباره-ما");
  });

  it("reserves system routes and internal paths", () => {
    for (const s of ["/admin", "/admin/x", "/cart", "/checkout", "/products/abc", "/api/x", "/_layout/header"]) {
      expect(isReservedSlug(s)).toBe(true);
    }
    expect(isReservedSlug("/landing/season")).toBe(false);
  });
});
