import { adminRoute, json } from "@/server/http";

export const runtime = "nodejs";

export const GET = adminRoute(async (_req, { user, store, memberships }) =>
  json({ user, store, memberships })
);
