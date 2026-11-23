import MessagesInbox, { type ContactMessage } from "@/components/admin/messages/MessagesInbox";
import { adminApi } from "@/lib/api/admin";
import type { Pagination } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ page?: string; unread?: string }> }) {
  const sp = await searchParams;
  const qs = new URLSearchParams({ page: String(Math.max(1, Number(sp.page) || 1)) });
  if (sp.unread === "1") qs.set("unread", "1");
  const [data, subs] = await Promise.all([
    adminApi<{ messages: ContactMessage[]; pagination: Pagination; unread: number }>(`/admin/messages?${qs}`),
    adminApi<{ total: number; subscribers: { email: string; createdAt: string }[] }>("/admin/subscribers"),
  ]);
  return <MessagesInbox {...data} onlyUnread={sp.unread === "1"} subscribers={subs} />;
}
