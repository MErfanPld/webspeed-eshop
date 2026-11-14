/**
 * Ordered schema migrations, applied via PRAGMA user_version.
 * Never edit a released migration — append a new one.
 */
export const MIGRATIONS: { version: number; sql: string }[] = [
  {
    version: 1,
    sql: `
      CREATE TABLE stores (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        domain TEXT UNIQUE,
        settings TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL
      );

      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE store_members (
        store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('owner','admin','editor')),
        PRIMARY KEY (store_id, user_id)
      );

      CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX idx_sessions_user ON sessions(user_id);

      CREATE TABLE pages (
        store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        id TEXT NOT NULL,
        slug TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        doc TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (store_id, id),
        UNIQUE (store_id, slug)
      );
    `,
  },
  {
    version: 2,
    sql: `
      CREATE TABLE categories (
        store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        id TEXT NOT NULL,
        slug TEXT NOT NULL,
        data TEXT NOT NULL,
        sort INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (store_id, id),
        UNIQUE (store_id, slug)
      );

      CREATE TABLE products (
        store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        id TEXT NOT NULL,
        slug TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','draft','archived')),
        data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (store_id, id),
        UNIQUE (store_id, slug)
      );

      CREATE TABLE media (
        store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        id TEXT NOT NULL,
        name TEXT NOT NULL,
        mime TEXT NOT NULL,
        size INTEGER NOT NULL,
        width INTEGER,
        height INTEGER,
        created_at TEXT NOT NULL,
        PRIMARY KEY (store_id, id)
      );

      CREATE TABLE orders (
        store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        id TEXT NOT NULL,
        number TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
        customer TEXT NOT NULL,
        items TEXT NOT NULL,
        subtotal INTEGER NOT NULL,
        shipping INTEGER NOT NULL DEFAULT 0,
        total INTEGER NOT NULL,
        receipt_media_id TEXT,
        note TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (store_id, id),
        UNIQUE (store_id, number)
      );
      CREATE INDEX idx_orders_created ON orders(store_id, created_at);
    `,
  },
];
