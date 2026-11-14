import TeamManager from "@/components/admin/team/TeamManager";
import { adminApi } from "@/lib/api/admin";
import type { Role } from "@/types/api";

export const dynamic = "force-dynamic";

export type Member = { userId: string; email: string; name: string; role: Role; isYou: boolean; createdAt: string };

export default async function AdminTeamPage() {
  const { members, canManage } = await adminApi<{ members: Member[]; canManage: boolean }>("/admin/members");
  return <TeamManager members={members} canManage={canManage} />;
}
