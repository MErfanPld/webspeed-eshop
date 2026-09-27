import type { PageRepository } from "./page-repository";
import {
  CURRENT_SCHEMA_VERSION,
  type ManagedPage,
  reassignBlockIds,
  toPlainJson,
} from "@/builder/contracts/page-contract";
import { migratePage, validatePage } from "@/builder/validation/page-schema";
import { homePageConfig } from "@/config/home-page";

const STORAGE_KEY = "webspeed-pages-v1";

function nowIso() {
  return new Date().toISOString();
}

function seedPages(): ManagedPage[] {
  const ts = nowIso();
  const homeBlocks = toPlainJson(homePageConfig.blocks) as ManagedPage["blocks"];
  return [
    {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      id: "home",
      name: "خانه",
      slug: "/",
      type: "home",
      status: "published",
      createdAt: ts,
      updatedAt: ts,
      publishedAt: ts,
      description: homePageConfig.description,
      blocks: homeBlocks,
      publishedBlocks: structuredClone(homeBlocks),
    },
    {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      id: "about",
      name: "درباره ما",
      slug: "/about",
      type: "content",
      status: "published",
      createdAt: ts,
      updatedAt: ts,
      publishedAt: ts,
      description: "صفحه درباره فروشگاه",
      blocks: [],
      publishedBlocks: [],
    },
    {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      id: "contact",
      name: "تماس با ما",
      slug: "/contact",
      type: "content",
      status: "published",
      createdAt: ts,
      updatedAt: ts,
      publishedAt: ts,
      description: "صفحه تماس",
      blocks: [],
      publishedBlocks: [],
    },
    {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      id: "landing-season",
      name: "لندینگ فصل جدید",
      slug: "/landing/season",
      type: "landing",
      status: "draft",
      createdAt: ts,
      updatedAt: ts,
      publishedAt: null,
      description: "صفحه کمپین فصلی",
      blocks: [],
    },
  ];
}

function writeAll(pages: ManagedPage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPlainJson(pages)));
  } catch (e) {
    console.error("[PageRepository] write failed", e);
    throw new Error("ذخیره صفحه ناموفق بود");
  }
}

function safeParseList(raw: string | null): ManagedPage[] {
  if (!raw) {
    const seeded = seedPages();
    writeAll(seeded);
    return seeded;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn("[PageRepository] Corrupted JSON — reseeding");
    const seeded = seedPages();
    writeAll(seeded);
    return seeded;
  }

  if (!Array.isArray(parsed)) {
    console.warn("[PageRepository] Expected array — reseeding");
    const seeded = seedPages();
    writeAll(seeded);
    return seeded;
  }

  const pages: ManagedPage[] = [];
  let needsRewrite = false;

  for (const item of parsed) {
    const migrated = migratePage(item);
    if (migrated.ok) {
      pages.push(migrated.data);
      if (
        !item ||
        typeof item !== "object" ||
        (item as { schemaVersion?: number }).schemaVersion !==
          CURRENT_SCHEMA_VERSION
      ) {
        needsRewrite = true;
      }
    } else {
      console.warn("[PageRepository] Dropping invalid page:", migrated.error);
      needsRewrite = true;
    }
  }

  if (!pages.length) {
    const seeded = seedPages();
    writeAll(seeded);
    return seeded;
  }

  if (needsRewrite) writeAll(pages);
  return pages;
}

function readAll(): ManagedPage[] {
  if (typeof window === "undefined") return seedPages();
  try {
    return safeParseList(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    console.error("[PageRepository] read failed", e);
    return seedPages();
  }
}

export class LocalStoragePageRepository implements PageRepository {
  async listPages(): Promise<ManagedPage[]> {
    return readAll().sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getPage(id: string): Promise<ManagedPage | null> {
    return readAll().find((p) => p.id === id) ?? null;
  }

  async getPublishedPage(id: string): Promise<ManagedPage | null> {
    const page = await this.getPage(id);
    if (!page) return null;
    if (page.status !== "published") return null;
    if (
      !Array.isArray(page.publishedBlocks) ||
      page.publishedBlocks.length === 0
    ) {
      return null;
    }
    const validated = validatePage(page);
    if (!validated.ok) {
      console.warn("[PageRepository] published page invalid:", validated.error);
      return null;
    }
    return validated.data;
  }

  async savePage(page: ManagedPage): Promise<ManagedPage> {
    const validated = validatePage({
      ...page,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      updatedAt: nowIso(),
    });
    if (!validated.ok) {
      throw new Error(`اعتبارسنجی صفحه ناموفق: ${validated.error}`);
    }

    const next = toPlainJson(validated.data);
    const pages = readAll();
    const idx = pages.findIndex((p) => p.id === next.id);
    if (idx >= 0) pages[idx] = next;
    else pages.push(next);
    writeAll(pages);
    return next;
  }

  async deletePage(id: string): Promise<void> {
    if (id === "home") {
      throw new Error("صفحه خانه قابل حذف نیست");
    }
    writeAll(readAll().filter((p) => p.id !== id));
  }

  async duplicatePage(id: string): Promise<ManagedPage> {
    const source = await this.getPage(id);
    if (!source) throw new Error("صفحه یافت نشد");

    const copy: ManagedPage = {
      ...toPlainJson(source),
      id: `${source.id}-copy-${Date.now()}`,
      name: `${source.name} (کپی)`,
      slug: `${source.slug}-copy`.replace(/\/+/g, "/"),
      status: "draft",
      schemaVersion: CURRENT_SCHEMA_VERSION,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      publishedAt: null,
      blocks: reassignBlockIds(source.blocks),
      publishedBlocks: undefined,
    };

    const pages = readAll();
    pages.push(copy);
    writeAll(pages);
    return copy;
  }

  async publishPage(id: string): Promise<ManagedPage> {
    const page = await this.getPage(id);
    if (!page) throw new Error("صفحه یافت نشد");
    return this.savePage({
      ...page,
      status: "published",
      publishedBlocks: toPlainJson(page.blocks),
      publishedAt: nowIso(),
      updatedAt: nowIso(),
    });
  }

  async unpublishPage(id: string): Promise<ManagedPage> {
    const page = await this.getPage(id);
    if (!page) throw new Error("صفحه یافت نشد");
    return this.savePage({
      ...page,
      status: "draft",
      publishedBlocks: [],
      publishedAt: null,
      updatedAt: nowIso(),
    });
  }
}

export const pageRepository: PageRepository =
  new LocalStoragePageRepository();
