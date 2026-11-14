"use client";

import { createContext, useContext, type ReactNode } from "react";

export type AdminRole = "owner" | "admin" | "editor";

export type AdminSession = {
  user: { id: string; email: string; name: string };
  store: { storeId: string; storeName: string; storeSlug: string; role: AdminRole };
  memberships: { storeId: string; storeName: string; storeSlug: string; role: AdminRole }[];
};

const Ctx = createContext<AdminSession | null>(null);

export function AdminSessionProvider({ value, children }: { value: AdminSession | null; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminSession(): AdminSession | null {
  return useContext(Ctx);
}
