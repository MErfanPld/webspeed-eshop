"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, UserPlus, Users } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import { api, errorMessage } from "@/lib/api/client";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import type { Member } from "@/app/admin/team/page";
import type { Role } from "@/types/api";

const ROLE_FA: Record<Role, string> = { owner: "مالک", admin: "مدیر", editor: "ویرایشگر" };
const ROLE_HINT: Record<Role, string> = {
  owner: "دسترسی کامل، مدیریت اعضا و تنظیمات",
  admin: "محصولات، سفارش‌ها، تنظیمات فروشگاه، حذف صفحات و رسانه",
  editor: "ویرایش صفحات و رسانه، مشاهده سفارش‌ها",
};

export default function TeamManager({ members, canManage }: { members: Member[]; canManage: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "editor" as Role });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      router.refresh();
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await run(() =>
      api("/admin/members", {
        method: "POST",
        body: { email: form.email, name: form.name, role: form.role, password: form.password || undefined },
      })
    );
    if (ok) setForm({ email: "", name: "", password: "", role: "editor" });
  };

  const remove = async (m: Member) => {
    const ok = await confirmDialog({
      title: `حذف «${m.name || m.email}» از فروشگاه؟`,
      message: "حساب کاربری حذف نمی‌شود؛ فقط دسترسی به این فروشگاه گرفته می‌شود.",
      confirmLabel: "حذف",
      danger: true,
    });
    if (ok) await run(() => api(`/admin/members/${m.userId}`, { method: "DELETE" }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader title="اعضای تیم" description="دسترسی افراد به این فروشگاه و نقش آن‌ها" />
      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {!members.length ? (
        <AdminEmptyState icon={<Users className="h-5 w-5" />} title="عضوی وجود ندارد" description="" />
      ) : (
        <div className="bg-white border border-[#E8E8E8] rounded-2xl divide-y divide-[#F0F0F0]">
          {members.map((m) => (
            <div key={m.userId} className="p-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[12rem]">
                <p className="font-semibold text-sm text-[#111]">
                  {m.name || m.email} {m.isYou && <span className="text-[11px] text-[#A3A3A3]">(شما)</span>}
                </p>
                <p className="text-[11px] text-[#737373]" dir="ltr">
                  {m.email}
                </p>
              </div>
              {canManage ? (
                <select
                  aria-label={`نقش ${m.email}`}
                  value={m.role}
                  disabled={busy}
                  onChange={(e) =>
                    run(() => api(`/admin/members/${m.userId}`, { method: "PATCH", body: { role: e.target.value } }))
                  }
                  className="h-9 rounded-lg border border-[#E8E8E8] px-2 text-sm bg-white"
                >
                  {(Object.keys(ROLE_FA) as Role[]).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_FA[r]}
                    </option>
                  ))}
                </select>
              ) : (
                <AdminBadge>{ROLE_FA[m.role]}</AdminBadge>
              )}
              {canManage && !m.isYou && (
                <button
                  type="button"
                  aria-label={`حذف ${m.email}`}
                  disabled={busy}
                  onClick={() => remove(m)}
                  className="h-9 w-9 rounded-lg hover:bg-red-50 text-red-600 inline-flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {canManage ? (
        <form onSubmit={add} className="bg-white border border-[#E8E8E8] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold inline-flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> افزودن عضو
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="block text-xs font-semibold text-[#525252] mb-1.5">ایمیل</span>
              <AdminInput type="email" dir="ltr" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-[#525252] mb-1.5">نقش</span>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="w-full h-11 rounded-xl border border-[#E8E8E8] px-3 text-sm bg-white"
              >
                {(Object.keys(ROLE_FA) as Role[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_FA[r]} — {ROLE_HINT[r]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-[#525252] mb-1.5">نام (برای کاربر جدید)</span>
              <AdminInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-[#525252] mb-1.5">رمز اولیه (فقط برای کاربر جدید)</span>
              <AdminInput type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
          </div>
          <p className="text-[11px] text-[#737373]">
            اگر این ایمیل قبلاً حساب داشته باشد، فقط به فروشگاه اضافه می‌شود. رمز اولیه را به‌صورت امن به عضو جدید بدهید تا پس از ورود آن را تغییر دهد.
          </p>
          <AdminButton type="submit" variant="primary" loading={busy}>
            افزودن
          </AdminButton>
        </form>
      ) : (
        <p className="text-xs text-[#737373]">فقط مالک فروشگاه می‌تواند اعضا را اضافه یا حذف کند.</p>
      )}
    </div>
  );
}
