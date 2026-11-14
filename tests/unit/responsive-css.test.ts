import { describe, expect, it } from "vitest";
import { combineResponsive, responsiveProp, visibilityClasses } from "@/builder/responsive/css";

describe("responsive CSS values", () => {
  it("emits variables for each device", () => {
    const r = responsiveProp("py", { desktop: 48, mobile: 16 });
    expect(r.className).toBe("ws-r-py");
    expect(r.style).toEqual({ "--ws-py-d": "48px", "--ws-py-m": "16px" });
  });

  it("treats plain numbers as desktop and applies fallbacks", () => {
    const r = responsiveProp("cols", 3, { unit: "", mobileFallback: 1 });
    expect(r.style).toEqual({ "--ws-cols-d": "3", "--ws-cols-m": "1" });
  });

  it("returns nothing when no value and no fallback", () => {
    expect(responsiveProp("mt", undefined)).toEqual({ className: "", style: {} });
  });

  it("combines classes and styles", () => {
    const c = combineResponsive(responsiveProp("mt", 8), responsiveProp("mb", undefined));
    expect(c.className).toBe("ws-r-mt");
    expect(c.style).toEqual({ "--ws-mt-d": "8px" });
  });

  it("maps visibility to media-query classes", () => {
    expect(visibilityClasses({ desktop: true, tablet: false, mobile: false })).toBe("ws-hide-t ws-hide-m");
    expect(visibilityClasses(undefined)).toBe("");
  });
});
