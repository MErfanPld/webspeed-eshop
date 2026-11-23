/**
 * Store theme → storefront CSS variables.
 * The API validates colors as #rrggbb and typography ranges; values are
 * re-checked here before being written into a <style> tag.
 */
export type ThemeColors = Partial<
  Record<
    | "primary"
    | "primaryHover"
    | "accent"
    | "accentHover"
    | "background"
    | "surface"
    | "foreground"
    | "muted"
    | "mutedForeground"
    | "border"
    | "error",
    string
  >
>;

export type StoreTheme = {
  colors: ThemeColors;
  typography: { baseSize?: number; lineHeight?: number };
};

/** Defaults = the values in globals.css */
export const DEFAULT_THEME: Required<{ colors: Required<ThemeColors>; typography: Required<StoreTheme["typography"]> }> = {
  colors: {
    primary: "#7c3aed",
    primaryHover: "#6d28d9",
    accent: "#db2777",
    accentHover: "#be185d",
    background: "#faf8ff",
    surface: "#ffffff",
    foreground: "#1e1b2e",
    muted: "#f3f0fa",
    mutedForeground: "#6b6880",
    border: "#ece8f5",
    error: "#e11d48",
  },
  typography: { baseSize: 16, lineHeight: 1.6 },
};

export const COLOR_LABELS: Record<keyof ThemeColors, string> = {
  primary: "رنگ اصلی (دکمه‌ها)",
  primaryHover: "رنگ اصلی (هاور)",
  accent: "رنگ تأکیدی",
  accentHover: "رنگ تأکیدی (هاور)",
  background: "پس‌زمینه صفحه",
  surface: "پس‌زمینه کارت‌ها",
  foreground: "متن",
  muted: "پس‌زمینه کم‌رنگ",
  mutedForeground: "متن کم‌رنگ",
  border: "حاشیه",
  error: "خطا",
};

const CSS_VAR: Record<keyof ThemeColors, string> = {
  primary: "--primary",
  primaryHover: "--primary-hover",
  accent: "--accent",
  accentHover: "--accent-hover",
  background: "--background",
  surface: "--surface",
  foreground: "--foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  border: "--border",
  error: "--error",
};

const HEX = /^#[0-9a-fA-F]{6}$/;

export function normalizeTheme(raw: unknown): StoreTheme | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as { colors?: Record<string, unknown>; typography?: Record<string, unknown> };
  const colors: ThemeColors = {};
  for (const key of Object.keys(CSS_VAR) as (keyof ThemeColors)[]) {
    const v = r.colors?.[key];
    if (typeof v === "string" && HEX.test(v)) colors[key] = v;
  }
  const typography: StoreTheme["typography"] = {};
  const base = Number(r.typography?.baseSize);
  if (Number.isFinite(base) && base >= 12 && base <= 22) typography.baseSize = base;
  const lh = Number(r.typography?.lineHeight);
  if (Number.isFinite(lh) && lh >= 1.2 && lh <= 2.2) typography.lineHeight = lh;
  return { colors, typography };
}

/** CSS for :root, or "" when the theme sets nothing */
export function themeCss(theme: StoreTheme | null): string {
  if (!theme) return "";
  const decls: string[] = [];
  for (const [key, value] of Object.entries(theme.colors)) {
    if (value && HEX.test(value)) decls.push(`${CSS_VAR[key as keyof ThemeColors]}:${value}`);
  }
  if (theme.typography.lineHeight) decls.push(`--leading-normal:${theme.typography.lineHeight}`);
  const rules = decls.length ? `:root{${decls.join(";")}}` : "";
  const base = theme.typography.baseSize ? `html{font-size:${theme.typography.baseSize}px}` : "";
  return rules + base;
}
