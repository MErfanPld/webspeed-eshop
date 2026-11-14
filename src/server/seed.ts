import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import type { Db } from "./db";
import {
  CURRENT_SCHEMA_VERSION,
  LAYOUT_SLUGS,
  SITE_FOOTER_ID,
  SITE_HEADER_ID,
  type ManagedPage,
} from "@/builder/contracts/page-contract";
import { createBlockInstance, regenerateIds } from "@/builder/registry/block-definitions";
import { homePageConfig } from "@/config/home-page";
import { products as sampleProducts } from "@/data/products";
import { categories as sampleCategories } from "@/data/categories";
import { storeInfo } from "@/data/store";
import { hashPasswordSync } from "./auth/password";

function insertPage(db: Db, storeId: string, page: ManagedPage) {
  db.prepare(
    `INSERT OR IGNORE INTO pages (store_id, id, slug, type, status, doc, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(storeId, page.id, page.slug, page.type, page.status, JSON.stringify(page), page.updatedAt);
}

function page(partial: Partial<ManagedPage> & Pick<ManagedPage, "id" | "name" | "slug" | "type">): ManagedPage {
  const ts = new Date().toISOString();
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    status: "draft",
    description: "",
    blocks: [],
    createdAt: ts,
    updatedAt: ts,
    publishedAt: null,
    ...partial,
  };
}

/** Default pages (and optionally the sample catalog) for a store */
export function seedStoreContent(db: Db, storeId: string, opts: { withSampleCatalog: boolean }) {
  const ts = new Date().toISOString();
  const homeBlocks = regenerateIds(structuredClone(homePageConfig.blocks)) as unknown as ManagedPage["blocks"];

  insertPage(
    db,
    storeId,
    page({
      id: "home",
      name: "خانه",
      slug: "/",
      type: "home",
      status: "published",
      description: homePageConfig.description,
      blocks: homeBlocks,
      publishedBlocks: structuredClone(homeBlocks),
      publishedAt: ts,
    })
  );
  insertPage(
    db,
    storeId,
    page({
      id: SITE_HEADER_ID,
      name: "هدر سراسری",
      slug: LAYOUT_SLUGS.header,
      type: "header",
      description: "تا زمان انتشار، هدر پیش‌فرض فروشگاه نمایش داده می‌شود.",
      blocks: [createBlockInstance("announcement-bar"), createBlockInstance("header")] as unknown as ManagedPage["blocks"],
    })
  );
  insertPage(
    db,
    storeId,
    page({
      id: SITE_FOOTER_ID,
      name: "فوتر سراسری",
      slug: LAYOUT_SLUGS.footer,
      type: "footer",
      description: "تا زمان انتشار، فوتر پیش‌فرض فروشگاه نمایش داده می‌شود.",
      blocks: [createBlockInstance("footer")] as unknown as ManagedPage["blocks"],
    })
  );
  insertPage(
    db,
    storeId,
    page({
      id: "about",
      name: "درباره ما",
      slug: "/about",
      type: "content",
      description: "تا زمان انتشار، صفحه پیش‌فرض «درباره ما» نمایش داده می‌شود.",
    })
  );
  insertPage(
    db,
    storeId,
    page({
      id: "contact",
      name: "تماس با ما",
      slug: "/contact",
      type: "content",
      description: "تا زمان انتشار، صفحه پیش‌فرض «تماس با ما» نمایش داده می‌شود.",
      blocks: [createBlockInstance("contact-form")] as unknown as ManagedPage["blocks"],
    })
  );

  if (!opts.withSampleCatalog) return;

  const insertCat = db.prepare("INSERT OR IGNORE INTO categories (store_id, id, slug, data, sort) VALUES (?, ?, ?, ?, ?)");
  sampleCategories.forEach((c, i) => insertCat.run(storeId, c.id, c.slug, JSON.stringify(c), i));

  const insertProduct = db.prepare(
    `INSERT OR IGNORE INTO products (store_id, id, slug, status, data, created_at, updated_at)
     VALUES (?, ?, ?, 'active', ?, ?, ?)`
  );
  sampleProducts.forEach((p, i) => {
    // Keep catalog order stable by created_at
    const created = new Date(Date.now() - (sampleProducts.length - i) * 60_000).toISOString();
    insertProduct.run(storeId, p.id, p.slug, JSON.stringify(p), created, created);
  });
}

/**
 * First run: default store, an owner account and sample content.
 * Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD. Without a password a
 * development default is used; in production a random one is generated and
 * printed once to the server log.
 */
export function ensureSeeded(db: Db) {
  if (db.prepare("SELECT 1 FROM stores LIMIT 1").get()) return;

  const email = (process.env.ADMIN_EMAIL || "admin@webspeed.local").toLowerCase();
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV === "production") {
      password = randomBytes(9).toString("base64url");
      console.warn(`[webspeed] Created owner ${email} with generated password: ${password}  (change it after login)`);
    } else {
      password = "admin12345";
      console.warn(`[webspeed] Development owner: ${email} / ${password}`);
    }
  }

  const now = new Date().toISOString();
  const storeId = randomUUID();
  const userId = randomUUID();

  db.exec("BEGIN");
  try {
    db.prepare("INSERT INTO stores (id, name, slug, domain, settings, created_at) VALUES (?, ?, ?, NULL, ?, ?)").run(
      storeId,
      storeInfo.name,
      "default",
      JSON.stringify({
        tagline: storeInfo.tagline,
        phone: storeInfo.phone,
        email: storeInfo.email,
        address: storeInfo.address,
        currency: "IRT",
        payment: { cardNumber: storeInfo.payment.cardNumber, cardHolder: storeInfo.payment.cardHolder },
        shipping: { flatRate: 0, freeOver: 2_500_000 },
      }),
      now
    );
    db.prepare("INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)").run(
      userId,
      email,
      "مدیر فروشگاه",
      hashPasswordSync(password),
      now
    );
    db.prepare("INSERT INTO store_members (store_id, user_id, role) VALUES (?, ?, 'owner')").run(storeId, userId);
    seedStoreContent(db, storeId, { withSampleCatalog: true });
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
