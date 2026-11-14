import "server-only";
import fs from "node:fs";
import path from "node:path";
import { randomUUID, randomInt } from "node:crypto";
import { getDb, tx } from "../db";
import { dataDir } from "../env";
import { HttpError, badRequest, notFound } from "../http";
import { catalogService } from "./catalog";
import { MAX_UPLOAD_BYTES, sniffImage } from "./media";
import { storeService } from "./stores";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export type OrderCustomer = {
  fullName: string;
  phone: string;
  email?: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  number: string;
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  hasReceipt: boolean;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

type Row = {
  id: string;
  number: string;
  status: OrderStatus;
  customer: string;
  items: string;
  subtotal: number;
  shipping: number;
  total: number;
  receipt_media_id: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

function toOrder(r: Row): Order {
  return {
    id: r.id,
    number: r.number,
    status: r.status,
    customer: JSON.parse(r.customer),
    items: JSON.parse(r.items),
    subtotal: r.subtotal,
    shipping: r.shipping,
    total: r.total,
    hasReceipt: Boolean(r.receipt_media_id),
    note: r.note,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Convert Persian/Arabic digits to ASCII */
export function toEnglishDigits(s: string): string {
  return s.replace(/[۰-۹٠-٩]/g, (d) => {
    const i = PERSIAN_DIGITS.indexOf(d);
    return String(i >= 0 ? i : ARABIC_DIGITS.indexOf(d));
  });
}

function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function validateCustomer(raw: Record<string, unknown>): OrderCustomer {
  const c: OrderCustomer = {
    fullName: text(raw.fullName, 120),
    phone: toEnglishDigits(text(raw.phone, 20)).replace(/[\s-]/g, ""),
    email: text(raw.email, 200) || undefined,
    province: text(raw.province, 60),
    city: text(raw.city, 60),
    address: text(raw.address, 500),
    postalCode: toEnglishDigits(text(raw.postalCode, 20)).replace(/[\s-]/g, ""),
  };
  const errors: Record<string, string> = {};
  if (!c.fullName) errors.fullName = "نام الزامی است";
  if (!/^09\d{9}$/.test(c.phone)) errors.phone = "شماره موبایل معتبر نیست (مثال: 09121234567)";
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) errors.email = "ایمیل معتبر نیست";
  if (!c.province) errors.province = "استان الزامی است";
  if (!c.city) errors.city = "شهر الزامی است";
  if (!c.address) errors.address = "آدرس الزامی است";
  if (!/^\d{10}$/.test(c.postalCode)) errors.postalCode = "کد پستی باید ۱۰ رقم باشد";
  if (Object.keys(errors).length) throw badRequest("اطلاعات ارسال را بررسی کنید", errors);
  return c;
}

function receiptPath(storeId: string, orderId: string, ext: string) {
  return path.join(dataDir(), "receipts", storeId, `${orderId}.${ext}`);
}

function newOrderNumber(): string {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `WS-${ymd}-${randomInt(1000, 9999)}${randomInt(10, 99)}`;
}

export const orderService = {
  /**
   * Checkout: prices, stock and shipping are computed on the server from the
   * catalog — the client only sends product ids, variants and quantities.
   */
  async create(
    storeId: string,
    input: { customer: Record<string, unknown>; items: unknown; receipt: File | null }
  ): Promise<Order> {
    const customer = validateCustomer(input.customer || {});
    if (!Array.isArray(input.items) || input.items.length === 0) throw badRequest("سبد خرید خالی است");
    if (input.items.length > 50) throw badRequest("تعداد اقلام سبد بیش از حد مجاز است");

    // Merge duplicate lines and validate variants against the catalog
    const merged = new Map<string, { productId: string; size: string; color: string; quantity: number }>();
    for (const raw of input.items as Record<string, unknown>[]) {
      const productId = text(raw?.productId, 80);
      const size = text(raw?.size, 40);
      const color = text(raw?.color, 40);
      const quantity = Math.floor(Number(raw?.quantity));
      if (!productId || !Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
        throw badRequest("اقلام سبد خرید نامعتبر است");
      }
      const key = `${productId}|${size}|${color}`;
      const prev = merged.get(key);
      merged.set(key, { productId, size, color, quantity: (prev?.quantity ?? 0) + quantity });
    }

    const items: OrderItem[] = [];
    for (const it of merged.values()) {
      const p = catalogService.getProduct(storeId, it.productId);
      if (!p || p.status !== "active") throw badRequest("یکی از محصولات سبد دیگر موجود نیست");
      if (p.sizes.length && !p.sizes.includes(it.size)) throw badRequest(`سایز انتخابی برای «${p.name}» معتبر نیست`);
      if (p.colors.length && !p.colors.some((c) => c.name === it.color)) {
        throw badRequest(`رنگ انتخابی برای «${p.name}» معتبر نیست`);
      }
      items.push({
        productId: p.id,
        slug: p.slug,
        name: p.name,
        image: p.images[0] || "",
        size: it.size,
        color: it.color,
        unitPrice: p.price,
        quantity: it.quantity,
        lineTotal: p.price * it.quantity,
      });
    }

    // Card-to-card payments need a receipt image
    if (!input.receipt) throw badRequest("تصویر رسید پرداخت را آپلود کنید");
    if (input.receipt.size > MAX_UPLOAD_BYTES) throw new HttpError(413, "حداکثر حجم رسید ۵ مگابایت است");
    const receiptBuf = new Uint8Array(await input.receipt.arrayBuffer());
    const kind = sniffImage(receiptBuf);
    if (!kind) throw badRequest("رسید باید تصویر PNG، JPG، WEBP یا GIF باشد");

    const store = storeService.get(storeId);
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const flat = Math.max(0, Number(store?.settings.shipping?.flatRate ?? 0));
    const freeOver = Number(store?.settings.shipping?.freeOver ?? 0);
    const shipping = freeOver > 0 && subtotal >= freeOver ? 0 : flat;
    const total = subtotal + shipping;

    const db = getDb();
    const id = randomUUID();
    const now = new Date().toISOString();
    const order = tx(db, () => {
      catalogService.reserveStock(
        storeId,
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      );
      let number = newOrderNumber();
      while (db.prepare("SELECT 1 FROM orders WHERE store_id = ? AND number = ?").get(storeId, number)) {
        number = newOrderNumber();
      }
      db.prepare(
        `INSERT INTO orders (store_id, id, number, status, customer, items, subtotal, shipping, total,
           receipt_media_id, note, created_at, updated_at)
         VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, NULL, ?, ?)`
      ).run(storeId, id, number, JSON.stringify(customer), JSON.stringify(items), subtotal, shipping, total, `${id}.${kind.ext}`, now, now);
      return this.get(storeId, id)!;
    });

    const file = receiptPath(storeId, id, kind.ext);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, receiptBuf);
    return order;
  },

  get(storeId: string, id: string): Order | null {
    const r = getDb().prepare("SELECT * FROM orders WHERE store_id = ? AND id = ?").get(storeId, id) as Row | undefined;
    return r ? toOrder(r) : null;
  },

  list(storeId: string, opts: { status?: string; q?: string; limit?: number } = {}): Order[] {
    const where = ["store_id = ?"];
    const args: (string | number)[] = [storeId];
    if (opts.status && ORDER_STATUSES.includes(opts.status as OrderStatus)) {
      where.push("status = ?");
      args.push(opts.status);
    }
    if (opts.q) {
      where.push("(number LIKE ? OR customer LIKE ?)");
      const like = `%${opts.q.replace(/[%_]/g, "")}%`;
      args.push(like, like);
    }
    const limit = Math.min(Math.max(opts.limit ?? 200, 1), 500);
    return (getDb()
      .prepare(`SELECT * FROM orders WHERE ${where.join(" AND ")} ORDER BY created_at DESC LIMIT ${limit}`)
      .all(...args) as Row[]).map(toOrder);
  },

  /** Change status; cancelling returns stock, un-cancelling reserves it again */
  updateStatus(storeId: string, id: string, status: OrderStatus, note?: string): Order {
    if (!ORDER_STATUSES.includes(status)) throw badRequest("وضعیت نامعتبر است");
    const db = getDb();
    return tx(db, () => {
      const order = this.get(storeId, id);
      if (!order) throw notFound("سفارش یافت نشد");
      if (order.status !== "cancelled" && status === "cancelled") {
        for (const it of order.items) {
          const p = catalogService.getProduct(storeId, it.productId);
          if (!p) continue;
          const { status: _s, createdAt: _c, updatedAt: _u, ...data } = p;
          db.prepare("UPDATE products SET data = ? WHERE store_id = ? AND id = ?").run(
            JSON.stringify({ ...data, stock: p.stock + it.quantity }),
            storeId,
            it.productId
          );
        }
      } else if (order.status === "cancelled" && status !== "cancelled") {
        catalogService.reserveStock(storeId, order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
      }
      db.prepare("UPDATE orders SET status = ?, note = COALESCE(?, note), updated_at = ? WHERE store_id = ? AND id = ?").run(
        status,
        note === undefined ? null : note.slice(0, 1000),
        new Date().toISOString(),
        storeId,
        id
      );
      return this.get(storeId, id)!;
    });
  },

  receipt(storeId: string, id: string): { data: Buffer; mime: string } {
    const r = getDb().prepare("SELECT receipt_media_id FROM orders WHERE store_id = ? AND id = ?").get(storeId, id) as
      | { receipt_media_id: string | null }
      | undefined;
    if (!r?.receipt_media_id) throw notFound("رسید یافت نشد");
    const ext = r.receipt_media_id.split(".").pop() || "jpg";
    const file = receiptPath(storeId, id, ext);
    if (!fs.existsSync(file)) throw notFound("رسید یافت نشد");
    const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
    return { data: fs.readFileSync(file), mime };
  },

  /** Lookup for the customer order-tracking page (number + phone must match) */
  track(storeId: string, number: string, phone: string): Order | null {
    const r = getDb().prepare("SELECT * FROM orders WHERE store_id = ? AND number = ?").get(storeId, number.trim().toUpperCase()) as
      | Row
      | undefined;
    if (!r) return null;
    const o = toOrder(r);
    return o.customer.phone === toEnglishDigits(phone).replace(/[\s-]/g, "") ? o : null;
  },

  stats(storeId: string, days = 30) {
    const db = getDb();
    const since = new Date(Date.now() - days * 86_400_000).toISOString();
    const agg = db
      .prepare(
        `SELECT COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
         FROM orders WHERE store_id = ? AND status != 'cancelled' AND created_at >= ?`
      )
      .get(storeId, since) as { orders: number; revenue: number };
    const customers = db
      .prepare(
        `SELECT COUNT(DISTINCT json_extract(customer, '$.phone')) AS n FROM orders WHERE store_id = ? AND created_at >= ?`
      )
      .get(storeId, since) as { n: number };
    const pending = db.prepare("SELECT COUNT(*) AS n FROM orders WHERE store_id = ? AND status = 'pending'").get(storeId) as { n: number };
    const byDay = db
      .prepare(
        `SELECT substr(created_at, 1, 10) AS day, COALESCE(SUM(total),0) AS revenue, COUNT(*) AS orders
         FROM orders WHERE store_id = ? AND status != 'cancelled' AND created_at >= ?
         GROUP BY day ORDER BY day`
      )
      .all(storeId, since) as { day: string; revenue: number; orders: number }[];
    const lowStock = catalogService
      .listProducts(storeId)
      .filter((p) => p.stock <= 3)
      .map((p) => ({ id: p.id, name: p.name, stock: p.stock }))
      .slice(0, 10);
    return {
      days,
      orders: agg.orders,
      revenue: agg.revenue,
      avgOrder: agg.orders ? Math.round(agg.revenue / agg.orders) : 0,
      customers: customers.n,
      pending: pending.n,
      byDay: byDay.map((d) => ({ ...d })),
      lowStock,
      recent: this.list(storeId, { limit: 5 }),
    };
  },

  /** Customers aggregated from orders (no customer accounts yet) */
  customers(storeId: string) {
    return (getDb()
      .prepare(
        `SELECT json_extract(customer, '$.phone') AS phone,
                MAX(json_extract(customer, '$.fullName')) AS name,
                MAX(json_extract(customer, '$.email')) AS email,
                COUNT(*) AS orders,
                COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END), 0) AS totalSpent,
                MIN(created_at) AS firstOrder,
                MAX(created_at) AS lastOrder
         FROM orders WHERE store_id = ? GROUP BY phone ORDER BY lastOrder DESC`
      )
      .all(storeId) as Record<string, unknown>[]).map((r) => ({ ...r }));
  },
};
