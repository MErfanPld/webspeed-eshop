import { describe, expect, it } from "vitest";
import { isSafeUrl, safeEmbedUrl, sanitizeUrls } from "@/lib/safe-url";

describe("safe urls", () => {
  it("allows relative, http(s), mailto, tel", () => {
    for (const u of ["/products", "#top", "?q=1", "products", "https://a.com", "http://a.com", "mailto:a@b.c", "tel:0912"]) {
      expect(isSafeUrl(u)).toBe(true);
    }
  });

  it("blocks script and data schemes, including obfuscated ones", () => {
    for (const u of ["javascript:alert(1)", " JaVaScRiPt:alert(1)", "java\nscript:alert(1)", "data:text/html,x", "vbscript:x", "//evil.com"]) {
      expect(isSafeUrl(u)).toBe(false);
    }
  });

  it("only allows https embeds", () => {
    expect(safeEmbedUrl("https://www.aparat.com/video/video/embed/x")).toContain("https://");
    expect(safeEmbedUrl("http://x.com")).toBeNull();
    expect(safeEmbedUrl("javascript:alert(1)")).toBeNull();
  });

  it("sanitizes nested block data", () => {
    const out = sanitizeUrls({
      ctaHref: "javascript:alert(1)",
      image: "data:image/svg+xml,<svg onload=alert(1)>",
      slides: [{ ctaHref: "/ok", title: "javascript:not-a-url-key" }],
    });
    expect(out).toEqual({ ctaHref: "#", image: "", slides: [{ ctaHref: "/ok", title: "javascript:not-a-url-key" }] });
  });
});
