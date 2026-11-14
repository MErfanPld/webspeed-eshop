"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, Store } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import { api, errorMessage } from "@/lib/api/client";

type Row = { id: string; name: string; slug: string; role: "owner" | "admin" | "editor"; domain: string | null };
const ROLE_FA = { owner: "مالک", admin: "مدیر", editor: "ویرایشگر" } as const;

export default function StoresManager({ stores, currentId }: { stores: Row[]; currentId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", slug: "", domain: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchTo = async (id: string) => {
    setBusy(true);
    try {
      await api("/admin/store", { method: "POST", body: { storeId: id } });
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/admin/store", {
        method: "POST",
        body: { create: { name: form.name, slug: form.slug, domain: form.domain || undefined } },
      });
      setForm({ name: "", slug: "", domain: "" });
      router.push("/admin/settings");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "ساخت فروشگاه ناموفق بود"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader title="فروشگاه‌ها" description="فروشگاه‌هایی که به آن‌ها دسترسی دارید. هر فروشگاه صفحات، محصولات، سفارش‌ها و رسانه جدا دارد." />
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      <div className="space-y-2">
        {stores.map((s) => (
          <div key={s.id} className="bg-white border border-[#E8E8E8] rounded-2xl p-4 flex items-center gap-3">
            <Store className="h-5 w-5 text-[#737373]" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{s.name}</p>
              <p className="text-[11px] text-[#A3A3A3] font-mono" dir="ltr">
                {s.slug}
                {s.domain ? ` · ${s.domain}` : ""}
              </p>
            </div>
            <AdminBadge>{ROLE_FA[s.role]}</AdminBadge>
            {s.id === currentId ? (
              <span className="text-xs text-emerald-700 inline-flex items-center gap-1">
                <Check className="h-4 w-4" /> فعال
              </span>
            ) : (
              <AdminButton size="sm" disabled={busy} onClick={() => switchTo(s.id)}>
                ورود
              </AdminButton>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={create} className="bg-white border border-[#E8E8E8] rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold">فروشگاه جدید</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="block text-xs font-semibold text-[#525252] mb-1.5">نام</span>
            <AdminInput value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-[#525252] mb-1.5">شناسه (انگلیسی)</span>
            <AdminInput value={form.slug} required dir="ltr" placeholder="my-shop" onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-[#525252] mb-1.5">دامنه (اختیاری)</span>
            <AdminInput value={form.domain} dir="ltr" placeholder="shop.example.com" onChange={(e) => setForm({ ...form, domain: e.target.value })} />
          </label>
        </div>
        <p className="text-[11px] text-[#737373]">
          فروشگاه جدید با صفحات پیش‌فرض (خانه، هدر/فوتر سراسری، درباره، تماس) و بدون محصول ساخته می‌شود. با تنظیم دامنه، بازدیدکنندگان آن دامنه این فروشگاه را می‌بینند.
        </p>
        <AdminButton type="submit" variant="primary" loading={busy}>
          <Plus className="h-4 w-4" />
          ساخت فروشگاه
        </AdminButton>
      </form>
    </div>
  );
}
