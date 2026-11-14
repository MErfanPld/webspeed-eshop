/**
 * CSS-driven responsive values.
 * ------------------------------------------------------------
 * Instead of resolving values from a React "device" context (which only
 * exists inside the builder), responsive values are emitted as CSS custom
 * properties and resolved by real media queries (see globals.css, section
 * "Responsive block values"). This works identically on the storefront and
 * inside the builder's iframe preview.
 *
 * Breakpoints (must match globals.css):
 *   desktop ≥ 1024px · tablet 768–1023px · mobile ≤ 767px
 */
import type { CSSProperties } from "react";
import type { DeviceKey, ResponsiveValue, VisibilitySettings } from "./types";

export const BREAKPOINTS = { tabletMax: 1023, mobileMax: 767 } as const;

/** Short property keys that have a matching `.ws-r-<key>` class in CSS */
export type ResponsiveCssKey = "mt" | "mb" | "py" | "maxw" | "cols" | "gap" | "h";

const SUFFIX: Record<DeviceKey, string> = { desktop: "d", tablet: "t", mobile: "m" };

function toCss(value: number, unit: string): string {
  return unit ? `${value}${unit}` : String(value);
}

function asResponsive(value: unknown): ResponsiveValue<number> | null {
  if (typeof value === "number" && Number.isFinite(value)) return { desktop: value };
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return { desktop: Number(value) };
  }
  if (value && typeof value === "object") {
    const r = value as ResponsiveValue<unknown>;
    const out: ResponsiveValue<number> = {};
    for (const k of ["desktop", "tablet", "mobile"] as const) {
      const n = r[k];
      if (typeof n === "number" && Number.isFinite(n)) out[k] = n;
    }
    return Object.keys(out).length ? out : null;
  }
  return null;
}

/**
 * Build CSS variables + class for one responsive property.
 * `fallback` is used for desktop when no value is given.
 */
export function responsiveProp(
  key: ResponsiveCssKey,
  value: unknown,
  opts: { unit?: string; fallback?: number; mobileFallback?: number; tabletFallback?: number } = {}
): { className: string; style: Record<string, string> } {
  const unit = opts.unit ?? "px";
  const r = asResponsive(value) ?? {};
  const desktop = r.desktop ?? opts.fallback;
  const tablet = r.tablet ?? opts.tabletFallback;
  const mobile = r.mobile ?? opts.mobileFallback;
  const style: Record<string, string> = {};
  if (desktop !== undefined) style[`--ws-${key}-${SUFFIX.desktop}`] = toCss(desktop, unit);
  if (tablet !== undefined) style[`--ws-${key}-${SUFFIX.tablet}`] = toCss(tablet, unit);
  if (mobile !== undefined) style[`--ws-${key}-${SUFFIX.mobile}`] = toCss(mobile, unit);
  if (!Object.keys(style).length) return { className: "", style };
  return { className: `ws-r-${key}`, style };
}

/** Merge several responsiveProp results */
export function combineResponsive(
  ...parts: { className: string; style: Record<string, string> }[]
): { className: string; style: CSSProperties } {
  return {
    className: parts.map((p) => p.className).filter(Boolean).join(" "),
    style: Object.assign({}, ...parts.map((p) => p.style)) as CSSProperties,
  };
}

/** Classes that hide a block per device via media queries */
export function visibilityClasses(vis: Partial<VisibilitySettings> | undefined): string {
  if (!vis) return "";
  const out: string[] = [];
  if (vis.desktop === false) out.push("ws-hide-d");
  if (vis.tablet === false) out.push("ws-hide-t");
  if (vis.mobile === false) out.push("ws-hide-m");
  return out.join(" ");
}
