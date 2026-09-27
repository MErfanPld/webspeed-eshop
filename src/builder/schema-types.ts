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
  | "visibility"
  | "spacing"
  | "responsiveNumber";

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
  group?: string;
  responsive?: boolean;
};

export type BlockSchema = FieldSchema[];

export type BlockCategory =
  | "layout"
  | "header"
  | "footer"
  | "marketing"
  | "products"
  | "catalog"
  | "content"
  | "store"
  | "commerce";

export type NestingRules = {
  canHaveChildren?: boolean;
  allowedChildren?: string[];
  allowedParents?: string[];
  maxDepth?: number;
};

export type BlockDefinition = {
  type: string;
  name: string;
  nameFa: string;
  category: BlockCategory;
  description: string;
  icon: string;
  defaultData: Record<string, unknown>;
  schema: BlockSchema;
  nesting?: NestingRules;
  defaultVisibility?: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
};
