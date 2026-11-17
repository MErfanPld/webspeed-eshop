import { redirect } from "next/navigation";
import PlatformStores from "@/components/admin/platform/PlatformStores";
import { adminApi, getAdminSession } from "@/lib/api/admin";
import type { PlanInfo, PlatformStoreRow } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function PlatformAdminPage() {
  const session = await getAdminSession();
  if (!session?.user.isPlatformAdmin) redirect("/admin");
  const data = await adminApi<{
    stores: PlatformStoreRow[];
    stats: { stores: number; active: number; inactive: number };
    plans: PlanInfo[];
  }>("/platform/stores");
  return <PlatformStores {...data} />;
}
