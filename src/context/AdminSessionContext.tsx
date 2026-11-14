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

/** Small JSON helper for admin API calls (Persian error messages) */
export async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const isForm = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const res = await fetch(url, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers: isForm ? init?.headers : { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const body = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
  }
  if (!res.ok) throw new Error(body.error || `خطای سرور (${res.status})`);
  return body;
}
