import "server-only";
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { getDb, tx } from "../db";
import { badRequest, conflict, notFound } from "../http";
import { seedStoreContent } from "../seed";

export type StoreSettings = {
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  currency?: string;
  /** Card-to-card payment details shown at checkout */
  payment?: { cardNumber?: string; cardHolder?: string; bank?: string };
  shipping?: { flatRate?: number; freeOver?: number };
};

export type Store = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  settings: StoreSettings;
  createdAt: string;
};

type Row = { id: string; name: string; slug: string; domain: string | null; settings: string; created_at: string };

function toStore(r: Row): Store {
  let settings: StoreSettings = {};
  try {
    settings = JSON.parse(r.settings || "{}");
  } catch {
    /* keep default */
  }
  return { id: r.id, name: r.name, slug: r.slug, domain: r.domain, settings, createdAt: r.created_at };
}

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;
const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export const storeService = {
  get(id: string): Store | null {
    const r = getDb().prepare("SELECT * FROM stores WHERE id = ?").get(id) as Row | undefined;
    return r ? toStore(r) : null;
  },

  list(): Store[] {
    return (getDb().prepare("SELECT * FROM stores ORDER BY created_at").all() as Row[]).map(toStore);
  },

  /** Storefront store for a request host: exact custom domain, else the default store */
  forHost(host: string | null): Store {
    const db = getDb();
    const clean = (host || "").split(":")[0].toLowerCase();
    if (clean) {
      const byDomain = db.prepare("SELECT * FROM stores WHERE domain = ?").get(clean) as Row | undefined;
      if (byDomain) return toStore(byDomain);
    }
    const wanted = process.env.DEFAULT_STORE_SLUG;
    const r = ((wanted && db.prepare("SELECT * FROM stores WHERE slug = ?").get(wanted)) ||
      db.prepare("SELECT * FROM stores ORDER BY created_at LIMIT 1").get()) as Row | undefined;
    if (!r) throw notFound("فروشگاهی تعریف نشده است");
    return toStore(r);
  },

  create(input: { name: string; slug: string; ownerId: string; domain?: string | null }): Store {
    const name = input.name?.trim();
    const slug = input.slug?.trim().toLowerCase();
    if (!name) throw badRequest("نام فروشگاه الزامی است");
    if (!slug || !SLUG_RE.test(slug)) throw badRequest("شناسه فروشگاه فقط حروف انگلیسی کوچک، عدد و - (۲ تا ۴۰ کاراکتر)");
    const domain = input.domain?.trim().toLowerCase() || null;
    if (domain && !DOMAIN_RE.test(domain)) throw badRequest("دامنه نامعتبر است");
    const db = getDb();
    return tx(db, () => {
      if (db.prepare("SELECT 1 FROM stores WHERE slug = ?").get(slug)) throw conflict("این شناسه قبلاً استفاده شده");
      if (domain && db.prepare("SELECT 1 FROM stores WHERE domain = ?").get(domain)) throw conflict("این دامنه قبلاً ثبت شده");
      const id = randomUUID();
      const now = new Date().toISOString();
      db.prepare("INSERT INTO stores (id, name, slug, domain, settings, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
        id,
        name,
        slug,
        domain,
        JSON.stringify({ currency: "IRT" }),
        now
      );
      db.prepare("INSERT INTO store_members (store_id, user_id, role) VALUES (?, ?, 'owner')").run(id, input.ownerId);
      seedStoreContent(db, id, { withSampleCatalog: false });
      return this.get(id)!;
    });
  },

  update(id: string, patch: { name?: string; domain?: string | null; settings?: StoreSettings }): Store {
    const cur = this.get(id);
    if (!cur) throw notFound("فروشگاه یافت نشد");
    const name = patch.name !== undefined ? patch.name.trim() : cur.name;
    if (!name) throw badRequest("نام فروشگاه الزامی است");
    let domain = cur.domain;
    if (patch.domain !== undefined) {
      domain = patch.domain?.trim().toLowerCase() || null;
      if (domain && !DOMAIN_RE.test(domain)) throw badRequest("دامنه نامعتبر است");
      const clash = domain && getDb().prepare("SELECT id FROM stores WHERE domain = ? AND id != ?").get(domain, id);
      if (clash) throw conflict("این دامنه قبلاً ثبت شده");
    }
    const settings = patch.settings ? { ...cur.settings, ...patch.settings } : cur.settings;
    getDb()
      .prepare("UPDATE stores SET name = ?, domain = ?, settings = ? WHERE id = ?")
      .run(name, domain, JSON.stringify(settings), id);
    return this.get(id)!;
  },
};

/** Store for the current storefront request (custom domain or default) */
export async function getStorefrontStore(): Promise<Store> {
  const h = await headers();
  return storeService.forHost(h.get("x-forwarded-host") || h.get("host"));
}
