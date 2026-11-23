import PlatformStores from "@/components/admin/platform/PlatformStores";
import { adminApi } from "@/lib/api/admin";
import { requirePlatformAdmin } from "@/lib/api/platform-admin";
import type { PlanInfo, PlatformStoreRow } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function PlatformAdminPage() {
  await requirePlatformAdmin();
  const data = await adminApi<{
    stores: PlatformStoreRow[];
    stats: { stores: number; active: number; inactive: number };
    plans: PlanInfo[];
  }>("/platform/stores");
  return <PlatformStores {...data} />;
}
