import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { DatabaseSync as DatabaseSyncType } from "node:sqlite";
import { dataDir } from "./env";
import { MIGRATIONS } from "./migrations";
import { ensureSeeded } from "./seed";

/**
 * SQLite through Node's built-in `node:sqlite` (Node ≥ 22.13): no native
 * build step, a single file in DATA_DIR. Loaded via getBuiltinModule so the
 * bundler never tries to resolve it.
 */
type SqliteModule = typeof import("node:sqlite");

function loadSqlite(): SqliteModule {
  const getBuiltin = (process as unknown as { getBuiltinModule?: (id: string) => unknown }).getBuiltinModule;
  const mod = getBuiltin?.("node:sqlite") as SqliteModule | undefined;
  if (!mod) {
    throw new Error("node:sqlite is not available — Node.js 22.13+ is required.");
  }
  return mod;
}

export type Db = DatabaseSyncType;

const globalForDb = globalThis as unknown as { __wsDb?: Db; __wsDbPath?: string };

function migrate(db: Db) {
  const row = db.prepare("PRAGMA user_version").get() as { user_version: number };
  let version = row.user_version;
  for (const m of MIGRATIONS) {
    if (m.version <= version) continue;
    db.exec("BEGIN");
    try {
      db.exec(m.sql);
      db.exec(`PRAGMA user_version = ${m.version}`);
      db.exec("COMMIT");
      version = m.version;
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
}

export function getDb(): Db {
  const file = path.join(dataDir(), "webspeed.db");
  if (globalForDb.__wsDb && globalForDb.__wsDbPath === file) return globalForDb.__wsDb;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const { DatabaseSync } = loadSqlite();
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  migrate(db);
  globalForDb.__wsDb = db;
  globalForDb.__wsDbPath = file;
  // Seed lazily on first open (idempotent)
  ensureSeeded(db);
  return db;
}

/** Run `fn` in a transaction */
export function tx<T>(db: Db, fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const out = fn();
    db.exec("COMMIT");
    return out;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
