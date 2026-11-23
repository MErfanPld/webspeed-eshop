import "server-only";
import { redirect } from "next/navigation";
import { getAdminSession } from "./admin";

/** Owner-only pages: anyone else goes back to the store panel */
export async function requirePlatformAdmin() {
  const session = await getAdminSession();
  if (!session?.user.isPlatformAdmin) redirect("/admin");
  return session;
}
