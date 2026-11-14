import MediaManager from "@/components/admin/media/MediaManager";
import { requireAdmin } from "@/server/http";
import { mediaService } from "@/server/services/media";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const { store } = await requireAdmin();
  return <MediaManager items={mediaService.list(store.storeId)} canDelete={store.role !== "editor"} />;
}
