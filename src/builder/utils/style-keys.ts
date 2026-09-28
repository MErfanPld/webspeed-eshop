/** Paths treated as style when copy-style is used */
export const STYLE_PATH_PREFIXES = [
  "paddingY",
  "paddingX",
  "background",
  "color",
  "textColor",
  "maxWidth",
  "gap",
  "columns",
  "height",
  "thickness",
  "radius",
  "align",
  "variant",
  "_visibility",
  "sticky",
];

export function pickStyleData(
  data: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(data)) {
    if (
      STYLE_PATH_PREFIXES.some(
        (p) => key === p || key.startsWith(p + ".") || key.startsWith("_")
      )
    ) {
      out[key] = structuredClone(data[key]);
    }
  }
  if (data._visibility) out._visibility = structuredClone(data._visibility);
  return out;
}

export function mergeStyleIntoData(
  data: Record<string, unknown>,
  style: Record<string, unknown>
): Record<string, unknown> {
  return { ...data, ...structuredClone(style) };
}
