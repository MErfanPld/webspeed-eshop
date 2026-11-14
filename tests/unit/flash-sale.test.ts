import { describe, expect, it } from "vitest";
import { resolveFlashSaleTarget } from "@/blocks/flash-sale/FlashSaleBlock";

const NOW = new Date("2026-05-10T10:00:00").getTime();

describe("flash sale countdown target", () => {
  it("uses a future end date", () => {
    const end = new Date("2026-05-11T10:00:00").toISOString();
    expect(resolveFlashSaleTarget(end, "none", NOW)).toBe(new Date(end).getTime());
  });

  it("rolls to next midnight for daily sales once the date passed", () => {
    const past = new Date("2026-05-01T00:00:00").toISOString();
    expect(resolveFlashSaleTarget(past, "daily", NOW)).toBe(new Date("2026-05-11T00:00:00").getTime());
  });

  it("rolls to next midnight when no date is set", () => {
    expect(resolveFlashSaleTarget("", undefined, NOW)).toBe(new Date("2026-05-11T00:00:00").getTime());
  });
});
