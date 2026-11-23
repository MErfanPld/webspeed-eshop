import PlansEditor from "@/components/admin/platform/PlansEditor";
import { adminApi } from "@/lib/api/admin";
import { requirePlatformAdmin } from "@/lib/api/platform-admin";
import type { PlanInfo } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  await requirePlatformAdmin();
  const { plans } = await adminApi<{ plans: (PlanInfo & { active: boolean })[] }>("/platform/admin/plans");
  return <PlansEditor plans={plans} />;
}
