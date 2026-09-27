import type { FieldSchema } from "@/builder/schema-types";

export const VISIBILITY_FIELDS: FieldSchema[] = [
  {
    type: "boolean",
    label: "نمایش در دسکتاپ",
    path: "_visibility.desktop",
    group: "نمایش",
  },
  {
    type: "boolean",
    label: "نمایش در تبلت",
    path: "_visibility.tablet",
    group: "نمایش",
  },
  {
    type: "boolean",
    label: "نمایش در موبایل",
    path: "_visibility.mobile",
    group: "نمایش",
  },
];

export function withVisibility(schema: FieldSchema[]): FieldSchema[] {
  return [...schema, ...VISIBILITY_FIELDS];
}
