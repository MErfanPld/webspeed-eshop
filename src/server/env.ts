import "server-only";
import path from "node:path";

/** Directory for the SQLite database and uploaded media */
export function dataDir(): string {
  return path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "data"));
}

export const isProduction = process.env.NODE_ENV === "production";
