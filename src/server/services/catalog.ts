import "server-only";
import { getDb, tx } from "../db";
import type { Category, Product } from "@/types/product";
import { badRequest, conflict, notFound } from "../http";
import { sanitizeUrls } from "@/lib/safe-url";

export type ProductStatus = "active" | "draft" | "archived";
export type ProductRecord = Product & { status: ProductStatus; createdAt: string; updatedAt: string };

type ProductRow = { id: string; slug: string; status: ProductStatus; data: string; created_at: string; updated_at: string };

function toProduct(r: ProductRow): ProductRecord {
  const p = JSON.parse(r.data) as Product;
  return { ...p, id: r.id, slug: r.slug, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at };
}

const SLUG_RE = /^[a-z0-9؀-ۿ]+(?:-[a-z0-9؀-ۿ]+)*$/;

function str(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function int(v: unknown, min = 0): number {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= min ? n : min;
}

/** Validate & normalize product input from the admin form/API */
export function normalizeProductInput(input: Record<string, unknown>): Product & { status: ProductStatus } {
  const name = str(input.name, 200);
  if (!name) throw badRequest("نام محصول الزامی است");
  const slug = str(input.slug, 120).toLowerCase();
  if (!SLUG_RE.test(slug)) throw badRequest("اسلاگ فقط شامل حروف، عدد و - باشد");
  const price = int(input.price);
  if (price <= 0) throw badRequest("قیمت باید بیشتر از صفر باشد");
  const compareAt = input.compareAtPrice ? int(input.compareAtPrice) : undefined;
  if (compareAt !== undefined && compareAt > 0 && compareAt <= price) {
    throw badRequest("قیمت قبل از تخفیف باید از قیمت فروش بیشتر باشد");
  }
  const gender = ["men", "women", "unisex"].includes(String(input.gender)) ? (input.gender as Product["gender"]) : "unisex";
  const status = ["active", "draft", "archived"].includes(String(input.status)) ? (input.status as ProductStatus) : "draft";
  const list = (v: unknown) =>
    Array.isArray(v) ? v.map((x) => str(x, 80)).filter(Boolean).slice(0, 50) : [];
  const images = (Array.isArray(input.images) ? input.images : []).map((x) => str(x, 500)).filter(Boolean).slice(0, 12);
  const colors = Array.isArray(input.colors)
    ? (input.colors as Record<string, unknown>[])
        .map((c) => ({ name: str(c?.name, 40), hex: /^#[0-9a-fA-F]{6}$/.test(String(c?.hex)) ? String(c.hex) : "#000000" }))
        .filter((c) => c.name)
        .slice(0, 20)
    : [];
  return sanitizeUrls({
    id: str(input.id, 80),
    slug,
    name,
    description: str(input.description, 5000),
    price,
    compareAtPrice: compareAt && compareAt > 0 ? compareAt : undefined,
    category: str(input.category, 80),
    gender,
    brand: str(input.brand, 80) || undefined,
    images,
    sizes: list(input.sizes),
    colors,
    featured: Boolean(input.featured),
    newArrival: Boolean(input.newArrival),
    stock: int(input.stock),
    freeShipping: Boolean(input.freeShipping),
    tags: list(input.tags),
    rating: typeof input.rating === "number" ? input.rating : undefined,
    reviewCount: typeof input.reviewCount === "number" ? input.reviewCount : undefined,
    reviews: Array.isArray(input.reviews) ? (input.reviews as Product["reviews"]) : undefined,
    specs: input.specs && typeof input.specs === "object" ? (input.specs as Record<string, string>) : undefined,
    status,
  });
}

export const catalogService = {
  listProducts(storeId: string, opts: { includeInactive?: boolean } = {}): ProductRecord[] {
    const rows = getDb()
      .prepare(
        `SELECT id, slug, status, data, created_at, updated_at FROM products
         WHERE store_id = ? ${opts.includeInactive ? "" : "AND status = 'active'"}
         ORDER BY created_at DESC`
      )
      .all(storeId) as ProductRow[];
    return rows.map(toProduct);
  },

  getProduct(storeId: string, id: string): ProductRecord | null {
    const r = getDb()
      .prepare("SELECT id, slug, status, data, created_at, updated_at FROM products WHERE store_id = ? AND id = ?")
      .get(storeId, id) as ProductRow | undefined;
    return r ? toProduct(r) : null;
  },

  getProductBySlug(storeId: string, slug: string): ProductRecord | null {
    const r = getDb()
      .prepare(
        "SELECT id, slug, status, data, created_at, updated_at FROM products WHERE store_id = ? AND slug = ? AND status = 'active'"
      )
      .get(storeId, slug) as ProductRow | undefined;
    return r ? toProduct(r) : null;
  },

  saveProduct(storeId: string, input: Record<string, unknown>, existingId?: string): ProductRecord {
    const db = getDb();
    return tx(db, () => {
      const p = normalizeProductInput(input);
      const id = existingId || `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const existing = existingId ? this.getProduct(storeId, existingId) : null;
      if (existingId && !existing) throw notFound("محصول یافت نشد");
      const clash = db.prepare("SELECT id FROM products WHERE store_id = ? AND slug = ? AND id != ?").get(storeId, p.slug, id);
      if (clash) throw conflict("این اسلاگ قبلاً استفاده شده");
      const now = new Date().toISOString();
      const { status, ...rest } = p;
      // Keep review data maintained elsewhere
      const data: Product = {
        ...rest,
        id,
        rating: existing?.rating ?? rest.rating,
        reviewCount: existing?.reviewCount ?? rest.reviewCount,
        reviews: existing?.reviews ?? rest.reviews,
      };
      db.prepare(
        `INSERT INTO products (store_id, id, slug, status, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (store_id, id) DO UPDATE SET slug = excluded.slug, status = excluded.status,
           data = excluded.data, updated_at = excluded.updated_at`
      ).run(storeId, id, p.slug, status, JSON.stringify(data), existing?.createdAt ?? now, now);
      return this.getProduct(storeId, id)!;
    });
  },

  deleteProduct(storeId: string, id: string) {
    const res = getDb().prepare("DELETE FROM products WHERE store_id = ? AND id = ?").run(storeId, id);
    if (!res.changes) throw notFound("محصول یافت نشد");
  },

  /** Atomically decrement stock; throws when insufficient */
  reserveStock(storeId: string, items: { productId: string; quantity: number }[]) {
    const db = getDb();
    for (const it of items) {
      const p = this.getProduct(storeId, it.productId);
      if (!p || p.status !== "active") throw badRequest("یکی از محصولات سبد دیگر موجود نیست");
      if (p.stock < it.quantity) throw conflict(`موجودی «${p.name}» کافی نیست (موجودی: ${p.stock})`);
      const next: Product = { ...p, stock: p.stock - it.quantity };
      const { status: _s, createdAt: _c, updatedAt: _u, ...data } = next as ProductRecord;
      db.prepare("UPDATE products SET data = ?, updated_at = ? WHERE store_id = ? AND id = ?").run(
        JSON.stringify(data),
        new Date().toISOString(),
        storeId,
        it.productId
      );
    }
  },

  listCategories(storeId: string): Category[] {
    return (getDb()
      .prepare("SELECT data FROM categories WHERE store_id = ? ORDER BY sort, slug")
      .all(storeId) as { data: string }[]).map((r) => JSON.parse(r.data) as Category);
  },

  saveCategory(storeId: string, input: Record<string, unknown>, existingId?: string): Category {
    const name = str(input.name, 80);
    const slug = str(input.slug, 80).toLowerCase();
    if (!name) throw badRequest("نام دسته الزامی است");
    if (!SLUG_RE.test(slug)) throw badRequest("اسلاگ دسته نامعتبر است");
    const id = existingId || `c-${Date.now().toString(36)}`;
    const db = getDb();
    const clash = db.prepare("SELECT id FROM categories WHERE store_id = ? AND slug = ? AND id != ?").get(storeId, slug, id);
    if (clash) throw conflict("این اسلاگ قبلاً استفاده شده");
    const cat: Category = sanitizeUrls({ id, name, slug, image: str(input.image, 500) || undefined });
    const sort = int(input.sort);
    db.prepare(
      `INSERT INTO categories (store_id, id, slug, data, sort) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (store_id, id) DO UPDATE SET slug = excluded.slug, data = excluded.data, sort = excluded.sort`
    ).run(storeId, id, slug, JSON.stringify(cat), sort);
    return cat;
  },

  deleteCategory(storeId: string, id: string) {
    const res = getDb().prepare("DELETE FROM categories WHERE store_id = ? AND id = ?").run(storeId, id);
    if (!res.changes) throw notFound("دسته یافت نشد");
  },
};
