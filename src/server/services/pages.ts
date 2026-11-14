import "server-only";
import { getDb, tx, type Db } from "../db";
import {
  CURRENT_SCHEMA_VERSION,
  LAYOUT_SLUGS,
  SITE_FOOTER_ID,
  SITE_HEADER_ID,
  isLayoutPageType,
  reassignBlockIds,
  toPlainJson,
  type ManagedPage,
  type SerializablePageBlock,
} from "@/builder/contracts/page-contract";
import { validatePage } from "@/builder/validation/page-schema";
import { isKnownBlockType } from "@/builder/registry/block-definitions";
import { isReservedSlug, isValidSlug, normalizeSlug } from "@/lib/page-slug";
import { sanitizeUrls } from "@/lib/safe-url";
import { badRequest, conflict, forbidden, notFound } from "../http";

const PROTECTED_IDS = new Set(["home", SITE_HEADER_ID, SITE_FOOTER_ID]);

function nowIso() {
  return new Date().toISOString();
}

type Row = { doc: string };

function parse(row: Row | undefined): ManagedPage | null {
  if (!row) return null;
  const v = validatePage(JSON.parse(row.doc));
  return v.ok ? v.data : null;
}

function assertKnownBlocks(blocks: SerializablePageBlock[], path = "blocks") {
  blocks.forEach((b, i) => {
    if (!isKnownBlockType(b.type)) throw badRequest(`نوع بلوک ناشناخته: ${b.type} (${path}[${i}])`);
    const kids = (b.data as { children?: unknown }).children;
    if (Array.isArray(kids)) assertKnownBlocks(kids as SerializablePageBlock[], `${path}[${i}].children`);
  });
}

function write(db: Db, storeId: string, page: ManagedPage) {
  db.prepare(
    `INSERT INTO pages (store_id, id, slug, type, status, doc, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (store_id, id) DO UPDATE SET
       slug = excluded.slug, type = excluded.type, status = excluded.status,
       doc = excluded.doc, updated_at = excluded.updated_at`
  ).run(storeId, page.id, page.slug, page.type, page.status, JSON.stringify(page), page.updatedAt);
}

/** Validate + normalize a page before writing (slug rules, block types, URLs) */
export function preparePage(raw: unknown, existing?: ManagedPage | null): ManagedPage {
  const v = validatePage(raw);
  if (!v.ok) throw badRequest(`اعتبارسنجی صفحه ناموفق: ${v.error}`);
  const page = toPlainJson(v.data);
  page.schemaVersion = CURRENT_SCHEMA_VERSION;
  page.updatedAt = nowIso();

  // System documents keep their type
  if (existing && PROTECTED_IDS.has(existing.id)) page.type = existing.type;

  if (page.type === "home") {
    page.slug = "/";
  } else if (isLayoutPageType(page.type)) {
    page.slug = LAYOUT_SLUGS[page.type];
  } else {
    page.slug = normalizeSlug(page.slug || "");
    if (!isValidSlug(page.slug) || page.slug === "/") throw badRequest(`آدرس نامعتبر است: ${page.slug}`);
    if (isReservedSlug(page.slug)) throw badRequest(`این مسیر سیستمی است و قابل استفاده نیست: ${page.slug}`);
  }

  assertKnownBlocks(page.blocks);
  page.blocks = sanitizeUrls(page.blocks);
  if (page.publishedBlocks) page.publishedBlocks = sanitizeUrls(page.publishedBlocks);
  if (page.seo) page.seo = sanitizeUrls(page.seo);
  // Status/publish snapshot are only changed through publish/unpublish
  if (existing) {
    page.status = existing.status;
    page.publishedBlocks = existing.publishedBlocks;
    page.publishedAt = existing.publishedAt;
    page.createdAt = existing.createdAt;
  }
  return page;
}

export const pageService = {
  list(storeId: string): ManagedPage[] {
    return (getDb()
      .prepare("SELECT doc FROM pages WHERE store_id = ? ORDER BY updated_at DESC")
      .all(storeId) as Row[])
      .map(parse)
      .filter((p): p is ManagedPage => p !== null);
  },

  get(storeId: string, id: string): ManagedPage | null {
    return parse(getDb().prepare("SELECT doc FROM pages WHERE store_id = ? AND id = ?").get(storeId, id) as Row | undefined);
  },

  getPublished(storeId: string, id: string): ManagedPage | null {
    const page = this.get(storeId, id);
    if (!page || page.status !== "published" || !page.publishedBlocks?.length) return null;
    return page;
  },

  getPublishedBySlug(storeId: string, slug: string): ManagedPage | null {
    const page = parse(
      getDb()
        .prepare("SELECT doc FROM pages WHERE store_id = ? AND slug = ? AND type NOT IN ('header','footer')")
        .get(storeId, normalizeSlug(slug)) as Row | undefined
    );
    if (!page || page.status !== "published" || !page.publishedBlocks?.length) return null;
    return page;
  },

  /** Create a new custom page */
  create(storeId: string, input: { name: string; slug: string; type?: ManagedPage["type"] }): ManagedPage {
    const name = (input.name || "").trim();
    if (!name) throw badRequest("نام صفحه الزامی است");
    const type = input.type && !isLayoutPageType(input.type) && input.type !== "home" ? input.type : "custom";
    const ts = nowIso();
    return this.save(
      storeId,
      {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        id: `page-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        name,
        slug: input.slug,
        type,
        status: "draft",
        description: "",
        blocks: [],
        createdAt: ts,
        updatedAt: ts,
        publishedAt: null,
      },
      { isNew: true }
    );
  },

  save(storeId: string, raw: unknown, opts: { isNew?: boolean } = {}): ManagedPage {
    const db = getDb();
    return tx(db, () => {
      const id = (raw as { id?: unknown })?.id;
      const existing = typeof id === "string" ? this.get(storeId, id) : null;
      if (!existing && !opts.isNew) throw notFound("صفحه یافت نشد");
      if (existing && opts.isNew) throw conflict("شناسه صفحه تکراری است");
      const page = preparePage(raw, existing);
      if (opts.isNew) page.createdAt = (raw as ManagedPage).createdAt || page.updatedAt;
      const clash = db
        .prepare("SELECT id FROM pages WHERE store_id = ? AND slug = ? AND id != ?")
        .get(storeId, page.slug, page.id) as { id: string } | undefined;
      if (clash) throw conflict(`این آدرس قبلاً استفاده شده: ${page.slug}`);
      write(db, storeId, page);
      return page;
    });
  },

  delete(storeId: string, id: string) {
    if (PROTECTED_IDS.has(id)) throw forbidden("صفحات سیستمی قابل حذف نیستند");
    const res = getDb().prepare("DELETE FROM pages WHERE store_id = ? AND id = ?").run(storeId, id);
    if (!res.changes) throw notFound("صفحه یافت نشد");
  },

  duplicate(storeId: string, id: string): ManagedPage {
    const source = this.get(storeId, id);
    if (!source) throw notFound("صفحه یافت نشد");
    if (isLayoutPageType(source.type)) throw badRequest("هدر و فوتر سراسری قابل تکرار نیستند");
    const taken = new Set(this.list(storeId).map((p) => p.slug));
    const root = source.slug === "/" ? "/home" : source.slug;
    let slug = `${root}-copy`;
    for (let i = 2; taken.has(slug); i++) slug = `${root}-copy-${i}`;
    const ts = nowIso();
    const copy: ManagedPage = {
      ...toPlainJson(source),
      id: `${source.id}-copy-${Date.now().toString(36)}`,
      name: `${source.name} (کپی)`,
      slug,
      type: source.type === "home" ? "landing" : source.type,
      status: "draft",
      createdAt: ts,
      updatedAt: ts,
      publishedAt: null,
      blocks: reassignBlockIds(source.blocks),
      publishedBlocks: undefined,
    };
    return this.save(storeId, copy, { isNew: true });
  },

  publish(storeId: string, id: string): ManagedPage {
    const db = getDb();
    return tx(db, () => {
      const page = this.get(storeId, id);
      if (!page) throw notFound("صفحه یافت نشد");
      const ts = nowIso();
      const next: ManagedPage = {
        ...page,
        status: "published",
        publishedBlocks: toPlainJson(page.blocks),
        publishedAt: ts,
        updatedAt: ts,
      };
      write(db, storeId, next);
      return next;
    });
  },

  unpublish(storeId: string, id: string): ManagedPage {
    const db = getDb();
    return tx(db, () => {
      const page = this.get(storeId, id);
      if (!page) throw notFound("صفحه یافت نشد");
      const next: ManagedPage = { ...page, status: "draft", publishedBlocks: [], publishedAt: null, updatedAt: nowIso() };
      write(db, storeId, next);
      return next;
    });
  },
};
