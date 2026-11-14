import MediaManager from "@/components/admin/media/MediaManager";
import { adminApi, getAdminSession } from "@/lib/api/admin";
import type { MediaItem } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const [{ items }, session] = await Promise.all([adminApi<{ items: MediaItem[] }>("/admin/media"), getAdminSession()]);
  return <MediaManager items={items} canDelete={session?.store.role !== "editor"} />;
}
