"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Plus, Save, Trash2 } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import { api, errorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const ICONS = [
  "MousePointerClick", "Globe", "CreditCard", "Percent", "MessageSquare", "Users", "Palette", "BarChart3", "ShieldCheck",
  "Store", "LayoutTemplate", "Smartphone", "Rocket", "Truck", "Search", "Zap", "Package", "Headphones", "Lock", "Sparkles",
  "PenTool", "Image", "Settings", "CheckCircle2",
];

type Col = { key: string; label: string; type?: "text" | "textarea" | "icon" | "rating"; wide?: boolean };
const LISTS: Record<string, { label: string; cols: Col[]; empty: Record<string, unknown> }> = {
  features: {
    label: "امکانات",
    cols: [{ key: "icon", label: "آیکون", type: "icon" }, { key: "title", label: "عنوان" }, { key: "text", label: "توضیح", type: "textarea", wide: true }],
    empty: { icon: "Sparkles", title: "", text: "" },
  },
  roadmap: {
    label: "نقشه ساخت",
    cols: [{ key: "icon", label: "آیکون", type: "icon" }, { key: "when", label: "زمان" }, { key: "title", label: "عنوان" }, { key: "text", label: "توضیح", type: "textarea", wide: true }],
    empty: { icon: "CheckCircle2", when: "", title: "", text: "" },
  },
  faq: {
    label: "سؤالات متداول",
    cols: [{ key: "question", label: "سؤال", wide: true }, { key: "answer", label: "پاسخ", type: "textarea", wide: true }],
    empty: { question: "", answer: "" },
  },
  testimonials: {
    label: "نظرات مشتریان",
    cols: [{ key: "name", label: "نام" }, { key: "role", label: "سمت / فروشگاه" }, { key: "rating", label: "امتیاز", type: "rating" }, { key: "store_url", label: "لینک فروشگاه" }, { key: "text", label: "متن نظر", type: "textarea", wide: true }],
    empty: { name: "", role: "", rating: 5, store_url: "", text: "" },
  },
};

const SETTINGS: { key: string; label: string; type?: "textarea" | "ltr" }[] = [
  { key: "heroBadge", label: "برچسب بالای عنوان" },
  { key: "heroTitle", label: "عنوان اصلی" },
  { key: "heroHighlight", label: "بخش رنگی عنوان" },
  { key: "heroTitleEnd", label: "ادامه عنوان" },
  { key: "heroSubtitle", label: "توضیح زیر عنوان", type: "textarea" },
  { key: "ctaPrimary", label: "متن دکمه اصلی" },
  { key: "ctaSecondary", label: "متن دکمه دوم" },
  { key: "videoTitle", label: "عنوان بخش ویدیو" },
  { key: "videoText", label: "توضیح بخش ویدیو", type: "textarea" },
  { key: "videoUrl", label: "لینک ویدیو (آپارات / یوتیوب / mp4)", type: "ltr" },
  { key: "supportPhone", label: "تلفن پشتیبانی", type: "ltr" },
  { key: "supportEmail", label: "ایمیل پشتیبانی", type: "ltr" },
  { key: "supportHours", label: "ساعات پاسخ‌گویی" },
  { key: "instagram", label: "اینستاگرام (بدون @)", type: "ltr" },
  { key: "telegram", label: "تلگرام (بدون @)", type: "ltr" },
  { key: "enamadHtml", label: "کد نماد اعتماد (اینماد)", type: "textarea" },
];

function Msg({ m }: { m: { ok: boolean; text: string } | null }) {
  return m ? <span role={m.ok ? "status" : "alert"} className={cn("text-xs", m.ok ? "text-emerald-700" : "text-red-600")}>{m.text}</span> : null;
}

function SettingsTab() {
  const [s, setS] = useState<Record<string, string | boolean> | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    api<{ settings: Record<string, string | boolean> }>("/platform/admin/landing").then((r) => setS(r.settings)).catch((e) => setMsg({ ok: false, text: errorMessage(e) }));
  }, []);
  if (!s) return <p className="text-sm text-[#9a97ab]">در حال بارگذاری...{msg && <Msg m={msg} />}</p>;
  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ settings: Record<string, string | boolean> }>("/platform/admin/landing", { method: "PATCH", body: s });
      setS(r.settings);
      setMsg({ ok: true, text: "ذخیره شد" });
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e, "ذخیره ناموفق بود") });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="rounded-2xl bg-white border border-[#ece8f5] p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {SETTINGS.map((f) => (
          <label key={f.key} className={cn("block", f.type === "textarea" && "sm:col-span-2")}>
            <span className="block text-xs font-semibold text-[#525252] mb-1.5">{f.label}</span>
            {f.type === "textarea" ? (
              <textarea name={f.key} rows={3} value={String(s[f.key] ?? "")} onChange={(e) => setS({ ...s, [f.key]: e.target.value })} dir={f.key === "enamadHtml" ? "ltr" : undefined} className="w-full rounded-xl border border-[#E8E8E8] px-3 py-2 text-sm leading-7" />
            ) : (
              <AdminInput name={f.key} value={String(s[f.key] ?? "")} onChange={(e) => setS({ ...s, [f.key]: e.target.value })} dir={f.type === "ltr" ? "ltr" : undefined} />
            )}
          </label>
        ))}
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(s.showStats)} onChange={(e) => setS({ ...s, showStats: e.target.checked })} /> نمایش آمار واقعی پلتفرم در بخش اول
      </label>
      <p className="text-[11px] text-[#9a97ab]">برای آپلود فایل ویدیو یا تصویر پیش‌نمایش از django-admin («تنظیمات سایت معرفی») استفاده کنید.</p>
      <div className="flex items-center gap-3">
        <AdminButton variant="primary" loading={busy} onClick={save}><Save className="h-4 w-4" /> ذخیره تنظیمات</AdminButton>
        <Msg m={msg} />
      </div>
    </div>
  );
}

type Row = Record<string, unknown> & { id?: number; active?: boolean };

function ListTab({ kind }: { kind: string }) {
  const conf = LISTS[kind];
  const [items, setItems] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    setItems(null);
    api<{ items: Row[] }>(`/platform/admin/content/${kind}`).then((r) => setItems(r.items)).catch((e) => setMsg({ ok: false, text: errorMessage(e) }));
  }, [kind]);
  if (!items) return <p className="text-sm text-[#9a97ab]">در حال بارگذاری...</p>;
  const update = (i: number, patch: Row) => setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setItems(next);
  };
  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ items: Row[] }>(`/platform/admin/content/${kind}`, { method: "PUT", body: { items } });
      setItems(r.items);
      setMsg({ ok: true, text: "ذخیره شد؛ روی سایت معرفی اعمال شد." });
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e, "ذخیره ناموفق بود") });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-3">
      {kind === "testimonials" && (
        <p className="text-xs text-[#92400e] bg-[#fffbeb] rounded-xl px-4 py-3">فقط نظرات واقعی مشتری‌ها را وارد کنید. تا این لیست خالی است، بخش نظرات روی سایت نمایش داده نمی‌شود.</p>
      )}
      {items.map((it, i) => (
        <div key={it.id ?? `new-${i}`} className={cn("rounded-2xl bg-white border p-4", it.active === false ? "border-dashed border-[#d4d4d8] opacity-70" : "border-[#ece8f5]")} data-testid="content-row">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-6 w-6 rounded-lg bg-[#f3f0fa] text-[#7c3aed] text-xs font-bold grid place-items-center">{i + 1}</span>
            <span className="flex-1" />
            <label className="inline-flex items-center gap-1.5 text-xs"><input type="checkbox" checked={it.active !== false} onChange={(e) => update(i, { active: e.target.checked })} /> نمایش</label>
            <button type="button" aria-label="بالا" disabled={i === 0} onClick={() => move(i, -1)} className="h-8 w-8 rounded-lg hover:bg-[#f3f0fa] grid place-items-center disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
            <button type="button" aria-label="پایین" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="h-8 w-8 rounded-lg hover:bg-[#f3f0fa] grid place-items-center disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
            <button type="button" aria-label="حذف" onClick={() => setItems(items.filter((_, j) => j !== i))} className="h-8 w-8 rounded-lg hover:bg-red-50 text-red-600 grid place-items-center"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {conf.cols.map((c) => (
              <label key={c.key} className={cn("block", c.wide && "sm:col-span-3")}>
                <span className="block text-[11px] font-semibold text-[#6b6880] mb-1">{c.label}</span>
                {c.type === "textarea" ? (
                  <textarea rows={2} value={String(it[c.key] ?? "")} onChange={(e) => update(i, { [c.key]: e.target.value })} className="w-full rounded-xl border border-[#E8E8E8] px-3 py-2 text-sm leading-7" />
                ) : c.type === "icon" ? (
                  <select value={String(it[c.key] ?? "Sparkles")} onChange={(e) => update(i, { [c.key]: e.target.value })} className="w-full h-10 rounded-xl border border-[#E8E8E8] bg-white px-2 text-sm" dir="ltr">
                    {ICONS.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                ) : c.type === "rating" ? (
                  <select value={Number(it[c.key] ?? 5)} onChange={(e) => update(i, { [c.key]: Number(e.target.value) })} className="w-full h-10 rounded-xl border border-[#E8E8E8] bg-white px-2 text-sm">
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}
                  </select>
                ) : (
                  <AdminInput value={String(it[c.key] ?? "")} onChange={(e) => update(i, { [c.key]: e.target.value })} dir={c.key === "store_url" ? "ltr" : undefined} />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <AdminButton onClick={() => setItems([...items, { ...conf.empty, active: true }])}><Plus className="h-4 w-4" /> افزودن ردیف</AdminButton>
        <AdminButton variant="primary" loading={busy} onClick={save}><Save className="h-4 w-4" /> ذخیره {conf.label}</AdminButton>
        <Msg m={msg} />
      </div>
    </div>
  );
}

export default function ContentEditor() {
  const [tab, setTab] = useState("settings");
  const tabs = [["settings", "تنظیمات و ویدیو"], ...Object.entries(LISTS).map(([k, v]) => [k, v.label])];
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="محتوای سایت معرفی"
        description="همه متن‌های صفحه اصلی پلتفرم؛ تغییرات بلافاصله روی سایت دیده می‌شود."
        actions={<a href="/platform" target="_blank" rel="noopener" className="text-sm inline-flex items-center gap-1.5 text-[#6d28d9] font-semibold">مشاهده سایت <ExternalLink className="h-4 w-4" /></a>}
      />
      <nav className="flex gap-1.5 flex-wrap" role="tablist" aria-label="بخش‌ها">
        {tabs.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={cn("h-9 px-4 rounded-xl text-sm font-medium transition", tab === k ? "bg-gradient-to-l from-[#7c3aed] to-[#db2777] text-white shadow-md shadow-[#7c3aed]/20" : "bg-white border border-[#ece8f5] text-[#525252] hover:border-[#c4b5fd]")}>
            {label}
          </button>
        ))}
      </nav>
      {tab === "settings" ? <SettingsTab /> : <ListTab kind={tab} />}
    </div>
  );
}
