"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Star } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import type { PlanInfo } from "@/types/api";
import { api, errorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

type Plan = PlanInfo & { active: boolean };

function PlanCard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [p, setP] = useState(plan);
  const [features, setFeatures] = useState(plan.features.join("\n"));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const field = "block text-xs font-semibold text-[#525252] mb-1.5";

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await api(`/platform/admin/plans/${p.slug}`, {
        method: "PATCH",
        body: { ...p, features: features.split("\n").map((f) => f.trim()).filter(Boolean) },
      });
      setMsg({ ok: true, text: "ذخیره شد؛ روی سایت معرفی اعمال شد." });
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e, "ذخیره ناموفق بود") });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={cn("rounded-2xl bg-white border p-5 space-y-4", p.highlighted ? "border-[#c4b5fd] ring-2 ring-[#7c3aed]/10" : "border-[#ece8f5]")} data-testid="plan-editor">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[#9a97ab]" dir="ltr">{p.slug}</span>
        {p.highlighted && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9] inline-flex items-center gap-1"><Star className="h-3 w-3" /> پیشنهادی</span>}
        {!p.active && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e]">مخفی</span>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label><span className={field}>نام پلن</span><AdminInput value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></label>
        <label><span className={field}>توضیح کوتاه</span><AdminInput value={p.tagline} onChange={(e) => setP({ ...p, tagline: e.target.value })} /></label>
        <label><span className={field}>قیمت ماهانه (تومان)</span><AdminInput name="priceMonthly" type="number" min={0} dir="ltr" value={p.priceMonthly} onChange={(e) => setP({ ...p, priceMonthly: Number(e.target.value) })} /></label>
        <label><span className={field}>قیمت سالانه (تومان)</span><AdminInput type="number" min={0} dir="ltr" value={p.priceYearly} onChange={(e) => setP({ ...p, priceYearly: Number(e.target.value) })} /></label>
        <label><span className={field}>سقف محصول (خالی = نامحدود)</span><AdminInput type="number" min={1} dir="ltr" value={p.maxProducts ?? ""} onChange={(e) => setP({ ...p, maxProducts: e.target.value ? Number(e.target.value) : null })} /></label>
        <label><span className={field}>سقف اعضای تیم (خالی = نامحدود)</span><AdminInput type="number" min={1} dir="ltr" value={p.maxMembers ?? ""} onChange={(e) => setP({ ...p, maxMembers: e.target.value ? Number(e.target.value) : null })} /></label>
      </div>
      <label className="block">
        <span className={field}>امکانات (هر خط یک مورد؛ روی سایت تیک‌دار نمایش داده می‌شود)</span>
        <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={5} className="w-full rounded-xl border border-[#E8E8E8] px-3 py-2 text-sm leading-7" />
      </label>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={p.highlighted} onChange={(e) => setP({ ...p, highlighted: e.target.checked })} /> پلن پیشنهادی (برجسته)</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={p.customDomain} onChange={(e) => setP({ ...p, customDomain: e.target.checked })} /> دامنه اختصاصی</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={p.active} onChange={(e) => setP({ ...p, active: e.target.checked })} /> نمایش در سایت و ثبت‌نام</label>
      </div>
      <div className="flex items-center gap-3">
        <AdminButton variant="primary" loading={busy} onClick={save}><Save className="h-4 w-4" /> ذخیره</AdminButton>
        {msg && <span role={msg.ok ? "status" : "alert"} className={cn("text-xs", msg.ok ? "text-emerald-700" : "text-red-600")}>{msg.text}</span>}
      </div>
    </section>
  );
}

export default function PlansEditor({ plans }: { plans: Plan[] }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader title="پلن‌ها و قیمت" description="قیمت، محدودیت‌ها و امکانات هر پلن؛ تغییرات بلافاصله روی سایت معرفی و فرم ثبت‌نام اعمال می‌شود." />
      <div className="grid gap-5 lg:grid-cols-2">
        {plans.map((p) => <PlanCard key={p.slug} plan={p} />)}
      </div>
      <p className="text-xs text-[#6b6880]">«درآمد ماهانه» در داشبورد پلتفرم بر اساس قیمت فعلی پلن‌ها حساب می‌شود.</p>
    </div>
  );
}
