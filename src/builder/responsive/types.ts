export type DeviceKey = "desktop" | "tablet" | "mobile";

export type ResponsiveValue<T> = {
  desktop?: T;
  tablet?: T;
  mobile?: T;
};

export type VisibilitySettings = {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
};

export const DEFAULT_VISIBILITY: VisibilitySettings = {
  desktop: true,
  tablet: true,
  mobile: true,
};

export const VIEWPORTS: Record<
  DeviceKey,
  { width: number; height: number; label: string; labelFa: string }
> = {
  desktop: { width: 1440, height: 900, label: "Desktop", labelFa: "دسکتاپ" },
  tablet: { width: 768, height: 1024, label: "Tablet", labelFa: "تبلت" },
  mobile: { width: 390, height: 844, label: "Mobile", labelFa: "موبایل" },
};

export function resolveResponsive<T>(
  value: ResponsiveValue<T> | T | undefined,
  device: DeviceKey,
  fallback: T
): T {
  if (value == null) return fallback;
  if (
    typeof value !== "object" ||
    !(
      "desktop" in (value as object) ||
      "tablet" in (value as object) ||
      "mobile" in (value as object)
    )
  ) {
    return value as T;
  }
  const r = value as ResponsiveValue<T>;
  if (device === "mobile") return r.mobile ?? r.tablet ?? r.desktop ?? fallback;
  if (device === "tablet") return r.tablet ?? r.desktop ?? fallback;
  return r.desktop ?? fallback;
}

export function isVisibleOnDevice(
  visibility: VisibilitySettings | undefined,
  device: DeviceKey
): boolean {
  if (!visibility) return true;
  return visibility[device] !== false;
}
