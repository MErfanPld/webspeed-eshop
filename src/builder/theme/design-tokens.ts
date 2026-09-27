/**
 * Global design tokens — JSON serializable.
 */

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

export type ThemeTypography = {
  headingFont: string;
  bodyFont: string;
  headingWeight: number;
  bodyWeight: number;
  baseSize: number;
  lineHeight: number;
  h1: number;
  h2: number;
  h3: number;
};

export type ThemeSpacing = {
  sectionY: number;
  containerX: number;
  gridGap: number;
  stackGap: number;
};

export type ThemeRadius = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  button: number;
  card: number;
  input: number;
};

export type ThemeShadows = {
  sm: string;
  md: string;
  lg: string;
};

export type ThemeLayout = {
  containerMaxWidth: number;
  pageMaxWidth: number;
  breakpoints: { mobile: number; tablet: number; desktop: number };
};

export type ThemeSettings = {
  schemaVersion: number;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadows: ThemeShadows;
  layout: ThemeLayout;
};

export const DEFAULT_THEME: ThemeSettings = {
  schemaVersion: 1,
  colors: {
    primary: "#0f172a",
    secondary: "#64748b",
    accent: "#e11d48",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    muted: "#64748b",
    border: "#e2e8f0",
    success: "#16a34a",
    warning: "#d97706",
    error: "#dc2626",
  },
  typography: {
    headingFont: "Vazirmatn",
    bodyFont: "Vazirmatn",
    headingWeight: 700,
    bodyWeight: 400,
    baseSize: 16,
    lineHeight: 1.6,
    h1: 40,
    h2: 32,
    h3: 24,
  },
  spacing: {
    sectionY: 64,
    containerX: 24,
    gridGap: 24,
    stackGap: 16,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    button: 10,
    card: 16,
    input: 10,
  },
  shadows: {
    sm: "0 1px 2px rgba(15,23,42,0.06)",
    md: "0 4px 12px rgba(15,23,42,0.08)",
    lg: "0 12px 32px rgba(15,23,42,0.12)",
  },
  layout: {
    containerMaxWidth: 1280,
    pageMaxWidth: 1440,
    breakpoints: { mobile: 390, tablet: 768, desktop: 1440 },
  },
};

const THEME_KEY = "webspeed-theme-v1";

export function loadTheme(): ThemeSettings {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (!raw) return DEFAULT_THEME;
    const parsed = JSON.parse(raw) as ThemeSettings;
    return {
      ...DEFAULT_THEME,
      ...parsed,
      colors: { ...DEFAULT_THEME.colors, ...parsed.colors },
    };
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(theme: ThemeSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
}
