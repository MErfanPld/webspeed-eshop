import {
  CURRENT_SCHEMA_VERSION,
  type ManagedPage,
  type PageStatus,
  type PageType,
  type SerializablePageBlock,
  isPageStatus,
  isPageType,
} from "@/builder/contracts/page-contract";

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isSerializable(value: unknown, depth = 0): boolean {
  if (depth > 12) return false;
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
    return true;
  if (typeof value === "function" || typeof value === "symbol") return false;
  if (Array.isArray(value))
    return value.every((item) => isSerializable(item, depth + 1));
  if (isPlainObject(value))
    return Object.values(value).every((item) => isSerializable(item, depth + 1));
  return false;
}

export function validateBlock(
  raw: unknown
): ValidationResult<SerializablePageBlock> {
  if (!isPlainObject(raw)) return { ok: false, error: "Block must be an object" };
  if (typeof raw.id !== "string" || !raw.id.trim())
    return { ok: false, error: "Block id is required" };
  if (typeof raw.type !== "string" || !raw.type.trim())
    return { ok: false, error: "Block type is required" };
  if (!isPlainObject(raw.data))
    return { ok: false, error: `Block ${raw.id}: data must be an object` };
  if (!isSerializable(raw.data))
    return {
      ok: false,
      error: `Block ${raw.id}: data contains non-serializable values`,
    };
  return {
    ok: true,
    data: {
      id: raw.id,
      type: raw.type,
      enabled: typeof raw.enabled === "boolean" ? raw.enabled : true,
      data: raw.data as Record<string, unknown>,
    },
  };
}

export function validatePage(raw: unknown): ValidationResult<ManagedPage> {
  if (!isPlainObject(raw)) return { ok: false, error: "Page must be an object" };
  if (typeof raw.id !== "string" || !raw.id.trim())
    return { ok: false, error: "Page id is required" };
  if (typeof raw.name !== "string" || !raw.name.trim())
    return { ok: false, error: "Page name is required" };
  if (typeof raw.slug !== "string")
    return { ok: false, error: "Page slug is required" };
  if (!isPageStatus(raw.status)) return { ok: false, error: "Invalid page status" };
  if (!isPageType(raw.type)) return { ok: false, error: "Invalid page type" };
  if (!Array.isArray(raw.blocks))
    return { ok: false, error: "Page blocks must be an array" };

  const blocks: SerializablePageBlock[] = [];
  for (let i = 0; i < raw.blocks.length; i++) {
    const result = validateBlock(raw.blocks[i]);
    if (!result.ok)
      return { ok: false, error: `blocks[${i}]: ${result.error}` };
    blocks.push(result.data);
  }

  let publishedBlocks: SerializablePageBlock[] | undefined;
  if (raw.publishedBlocks !== undefined) {
    if (!Array.isArray(raw.publishedBlocks))
      return { ok: false, error: "publishedBlocks must be an array" };
    publishedBlocks = [];
    for (let i = 0; i < raw.publishedBlocks.length; i++) {
      const result = validateBlock(raw.publishedBlocks[i]);
      if (!result.ok)
        return { ok: false, error: `publishedBlocks[${i}]: ${result.error}` };
      publishedBlocks.push(result.data);
    }
  }

  const schemaVersion =
    typeof raw.schemaVersion === "number" && raw.schemaVersion > 0
      ? raw.schemaVersion
      : CURRENT_SCHEMA_VERSION;

  return {
    ok: true,
    data: {
      schemaVersion,
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      type: raw.type as PageType,
      status: raw.status as PageStatus,
      description:
        typeof raw.description === "string" ? raw.description : undefined,
      blocks,
      publishedBlocks,
      createdAt:
        typeof raw.createdAt === "string"
          ? raw.createdAt
          : new Date().toISOString(),
      updatedAt:
        typeof raw.updatedAt === "string"
          ? raw.updatedAt
          : new Date().toISOString(),
      publishedAt:
        typeof raw.publishedAt === "string" || raw.publishedAt === null
          ? (raw.publishedAt as string | null)
          : undefined,
    },
  };
}

export function migratePage(raw: unknown): ValidationResult<ManagedPage> {
  if (!isPlainObject(raw))
    return { ok: false, error: "Cannot migrate non-object" };
  const version =
    typeof raw.schemaVersion === "number" ? raw.schemaVersion : 0;
  const normalized = { ...raw };
  if (version < 1) {
    normalized.schemaVersion = 1;
    if (!Array.isArray(normalized.blocks)) normalized.blocks = [];
    if (!normalized.status) normalized.status = "draft";
    if (!normalized.type) normalized.type = "custom";
    if (!normalized.slug)
      normalized.slug = `/${String(normalized.id || "page")}`;
    if (!normalized.name) normalized.name = "صفحه";
    if (!normalized.createdAt) normalized.createdAt = new Date().toISOString();
    if (!normalized.updatedAt) normalized.updatedAt = new Date().toISOString();
  }
  return validatePage(normalized);
}
