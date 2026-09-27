/**
 * Schema-driven property panel field types.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "color"
  | "image"
  | "url"
  | "array"
  | "products"
  | "categories"
  | "richText";

export type SelectOption = {
  label: string;
  value: string | number | boolean;
};

export type FieldSchema = {
  type: FieldType;
  label: string;
  path: string;
  placeholder?: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  itemFields?: FieldSchema[];
  defaultItem?: Record<string, unknown>;
  description?: string;
};

export type BlockSchema = FieldSchema[];

export type BlockCategory =
  | "marketing"
  | "products"
  | "catalog"
  | "content"
  | "store";

export type BlockDefinition = {
  type: string;
  name: string;
  nameFa: string;
  category: BlockCategory;
  description: string;
  icon: string;
  defaultData: Record<string, unknown>;
  schema: BlockSchema;
};
