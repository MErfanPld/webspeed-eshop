"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import { api, errorMessage } from "@/lib/api/client";
import type { Store } from "@/types/api";

const label = "block text-xs font-semibold text-[#525252] mb-1.5";
const card = "bg-white border border-[#E8E8E8] rounded-2xl p-5 space-y-4";

export default function StoreSettingsForm({ store, canEdit }: { store: Store; canEdit: boolean }) {
  const router = useRouter();
  const s = store.settings;
  const [f, setF] = useState({
    name: store.name,
    domain: store.domain ?? "",
    tagline: s.tagline ?? "",
    phone: s.phone ?? "",
    email: s.email ?? "",
    address: s.address ?? "",
    workingHours: s.workingHours ?? "",
    instagram: s.instagram ?? "",
    cardNumber: s.payment?.cardNumber ?? "",
    cardHolder: s.payment?.cardHolder ?? "",
    bank: s.payment?.bank ?? "",
    flatRate: String(s.shipping?.flatRate ?? 0),
    freeOver: String(s.shipping?.freeOver ?? 0),
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await api("/admin/store", {
        method: "PATCH",
        body: {
          name: f.name,
          domain: f.domain || null,
          settings: {
            tagline: f.tagline,
            phone: f.phone,
            email: f.email,
            address: f.address,
            workingHours: f.workingHours,
            instagram: f.instagram,
            payment: { cardNumber: f.cardNumber, cardHolder: f.cardHolder, bank: f.bank },
            shipping: {
              flatRate: Number(f.flatRate.replace(/[^\d]/g, "") || 0),
              freeOver: Number(f.freeOver.replace(/[^\d]/g, "") || 0),
            },
          },
        },
      });
      setMsg({ ok: true, text: "تنظیمات ذخیره شد" });
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err, "ذخیره ناموفق بود") });
    } finally {
      setBusy(false);
    }
  };

  const field = (k: keyof typeof f, t: string, opts: { ltr?: boolean; ph?: string } = {}) => (
    <label className="block">
      <span className={label}>{t}</span>
      <AdminInput value={f[k]} disabled={!canEdit} dir={opts.ltr ? "ltr" : undefined} placeholder={opts.ph} onChange={(e) => set(k, e.target.value)} />
    </label>
  );

  return (
    <form onSubmit={save} className="max-w-3xl mx-auto space-y-6">
      <AdminPageHeader
        title="تنظیمات فروشگاه"
        description={`شناسه: ${store.slug}`}
        actions={canEdit ? <AdminButton type="submit" variant="primary" loading={busy}>ذخیره</AdminButton> : undefined}
      />
      {msg && (
        <p role="status" className={`text-sm rounded-xl px-4 py-3 ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </p>
      )}
      <section className={card}>
        <h2 className="text-sm font-bold">عمومی</h2>
        {field("name", "نام فروشگاه")}
        {field("tagline", "شعار / توضیح کوتاه")}
        {field("domain", "دامنه اختصاصی", { ltr: true, ph: "shop.example.com" })}
      </section>
      <section className={card}>
        <h2 className="text-sm font-bold">اطلاعات تماس</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("phone", "تلفن", { ltr: true })}
          {field("email", "ایمیل", { ltr: true })}
        </div>
        {field("address", "آدرس")}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("workingHours", "ساعات کاری")}
          {field("instagram", "لینک اینستاگرام", { ltr: true, ph: "https://instagram.com/..." })}
        </div>
      </section>
      <section className={card}>
        <h2 className="text-sm font-bold">پرداخت کارت‌به‌کارت</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("cardNumber", "شماره کارت", { ltr: true })}
          {field("cardHolder", "نام صاحب کارت")}
        </div>
        {field("bank", "بانک (اختیاری)")}
      </section>
      <section className={card}>
        <h2 className="text-sm font-bold">ارسال</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("flatRate", "هزینه ثابت ارسال (تومان)", { ltr: true })}
          {field("freeOver", "ارسال رایگان برای خرید بالای (تومان، ۰ = غیرفعال)", { ltr: true })}
        </div>
      </section>
    </form>
  );
}
