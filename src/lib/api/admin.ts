import "server-only";
import { redirect } from "next/navigation";
import type { AdminSession } from "@/context/AdminSessionContext";
import { ApiError } from "./client";
import { serverApi } from "./server";

/**
 * Server-side admin data (forwards the admin's cookies).
 * A 401 means the session could not be refreshed → back to login.
 */
export async function adminApi<T>(path: string): Promise<T> {
  try {
    return await serverApi<T>(path, { auth: true });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/admin/login");
    throw e;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    return await serverApi<AdminSession>("/auth/me", { auth: true });
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) return null;
    throw e;
  }
}
