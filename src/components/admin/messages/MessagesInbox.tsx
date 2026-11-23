"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inbox, Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import Pager from "@/components/admin/ui/Pager";
import type { Pagination } from "@/types/api";
import { api, errorMessage } from "@/lib/api/client";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { cn, formatNumber } from "@/lib/utils";

export type ContactMessage = { id: number; name: string; email: string; phone: string; message: string; read: boolean; createdAt: string };

type Subscribers = { total: number; subscribers: { email: string; createdAt: string }[] };

export default function MessagesInbox({ messages, pagination, unread, onlyUnread, subscribers }: { messages: ContactMessage[]; pagination: Pagination; unread: number; onlyUnread: boolean; subscribers: Subscribers }) {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setRead = async (m: ContactMessage, read: boolean) => {
    await api(`/admin/messages/${m.id}`, { method: "PATCH", body: { read } }).catch((e) => setError(errorMessage(e)));
    router.refresh();
  };
  const toggle = (m: ContactMessage) => {
    setOpen(open === m.id ? null : m.id);
    if (!m.read) void setRead(m, true);
  };
  const remove = async (m: ContactMessage) => {
    if (!(await confirmDialog({ title: "حذف این پیام؟", confirmLabel: "حذف", danger: true }))) return;
    await api(`/admin/messages/${m.id}`, { method: "DELETE" }).catch((e) => setError(errorMessage(e)));
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader title="پیام‌های مشتریان" description={`فرم «تماس با ما» فروشگاه · ${formatNumber(unread)} پیام خوانده‌نشده`} />
      <nav className="flex gap-2" aria-label="فیلتر">
        {[["همه", "/admin/messages", !onlyUnread], ["خوانده‌نشده", "/admin/messages?unread=1", onlyUnread]].map(([label, href, active]) => (
          <Link key={String(href)} href={String(href)} aria-current={active ? "page" : undefined}
            className={cn("h-9 px-4 rounded-xl text-sm inline-flex items-center border", active ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-white border-[#ece8f5]")}>
            {label}
          </Link>
        ))}
      </nav>
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      {!messages.length ? (
        <AdminEmptyState icon={<Inbox className="h-5 w-5" />} title="پیامی نیست" description="پیام‌هایی که مشتری‌ها از صفحه «تماس با ما» می‌فرستند اینجا نمایش داده می‌شوند." />
      ) : (
        <ul className="space-y-2">
          {messages.map((m) => (
            <li key={m.id} className={cn("rounded-2xl border bg-white", m.read ? "border-[#ece8f5]" : "border-[#c4b5fd] shadow-sm")} data-testid="message-row">
              <button type="button" onClick={() => toggle(m)} aria-expanded={open === m.id} className="w-full flex items-center gap-3 p-4 text-right">
                <span className={cn("h-10 w-10 rounded-xl grid place-items-center shrink-0", m.read ? "bg-[#f3f0fa] text-[#9a97ab]" : "bg-gradient-to-br from-[#7c3aed] to-[#db2777] text-white")}>
                  {m.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={cn("block text-sm", !m.read && "font-bold")}>{m.name}</span>
                  <span className="block text-xs text-[#9a97ab] truncate">{m.message}</span>
                </span>
                <span className="text-[11px] text-[#9a97ab] shrink-0">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(m.createdAt))}</span>
              </button>
              {open === m.id && (
                <div className="px-4 pb-4 space-y-3 ws-fade-in">
                  <p className="text-sm leading-8 whitespace-pre-line bg-[#fbfaff] rounded-xl p-4">{m.message}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {m.email && <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 text-[#6d28d9]" dir="ltr"><Mail className="h-4 w-4" /> {m.email}</a>}
                    {m.phone && <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1.5 text-[#6d28d9]" dir="ltr"><Phone className="h-4 w-4" /> {m.phone}</a>}
                    <span className="flex-1" />
                    <button type="button" onClick={() => setRead(m, false)} className="text-xs text-[#6b6880] hover:text-[#1e1b2e]">علامت خوانده‌نشده</button>
                    <button type="button" aria-label="حذف پیام" onClick={() => remove(m)} className="h-8 w-8 rounded-lg hover:bg-red-50 text-red-600 grid place-items-center"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <details className="rounded-2xl border border-[#ece8f5] bg-white p-4">
        <summary className="cursor-pointer font-bold text-sm">مشترکان خبرنامه ({formatNumber(subscribers.total)})</summary>
        {!subscribers.subscribers.length ? (
          <p className="mt-3 text-sm text-[#9a97ab]">هنوز کسی عضو خبرنامه نشده است.</p>
        ) : (
          <>
            <ul className="mt-3 max-h-72 overflow-auto divide-y divide-[#f3f0fa] text-sm">
              {subscribers.subscribers.map((s) => (
                <li key={s.email} className="py-2 flex justify-between gap-3">
                  <span dir="ltr">{s.email}</span>
                  <span className="text-xs text-[#9a97ab]">{new Intl.DateTimeFormat("fa-IR").format(new Date(s.createdAt))}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(subscribers.subscribers.map((s) => s.email).join("\n"))}
              className="mt-3 h-8 px-3 rounded-lg border border-[#ece8f5] text-xs font-semibold hover:bg-[#f3f0fa]"
            >
              کپی همه ایمیل‌ها
            </button>
          </>
        )}
      </details>
      <Pager pagination={pagination} hrefFor={(p) => `/admin/messages?${new URLSearchParams({ ...(onlyUnread ? { unread: "1" } : {}), page: String(p) })}`} />
    </div>
  );
}
