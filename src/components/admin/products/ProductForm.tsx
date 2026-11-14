"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, Trash2, X } from "lucide-react";
import type { Category } from "@/types/product";
import type { ProductRecord } from "@/types/api";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import MediaPickerButton from "@/builder/components/MediaPickerButton";
import { api, errorMessage } from "@/lib/api/client";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { slugFromName } from "@/lib/page-slug";

type Form = {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  category: string;
  gender: "men" | "women" | "unisex";
  brand: string;
  status: "active" | "draft" | "archived";
  featured: boolean;
  newArrival: boolean;
  freeShipping: boolean;
  images: string[];
  sizes: string;
  colors: { name: string; hex: string }[];
  tags: string;
};

function toForm(p: ProductRecord | null): Form {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    description: p?.description ?? "",
    price: p ? String(p.price) : "",
    compareAtPrice: p?.compareAtPrice ? String(p.compareAtPrice) : "",
    stock: p ? String(p.stock) : "0",
    category: p?.category ?? "",
    gender: p?.gender ?? "unisex",
    brand: p?.brand ?? "",
    status: p?.status ?? "draft",
    featured: p?.featured ?? false,
    newArrival: p?.newArrival ?? true,
    freeShipping: p?.freeShipping ?? false,
    images: p?.images ?? [],
    sizes: (p?.sizes ?? ["S", "M", "L"]).join("، "),
    colors: p?.colors ?? [{ name: "مشکی", hex: "#111111" }],
    tags: (p?.tags ?? []).join("، "),
  };
}

const splitList = (s: string) =>
  s
    .split(/[,،]/)
    .map((x) => x.trim())
    .filter(Boolean);

const label = "block text-xs font-semibold text-[#525252] mb-1.5";
const card = "bg-white border border-[#E8E8E8] rounded-2xl p-5 space-y-4";

export default function ProductForm({ initial, categories }: { initial: ProductRecord | null; categories: Category[] }) {
  const router = useRouter();
  const [f, setF] = useState<Form>(() => toForm(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...f,
        price: Number(f.price.replace(/[^\d]/g, "")),
        compareAtPrice: f.compareAtPrice ? Number(f.compareAtPrice.replace(/[^\d]/g, "")) : undefined,
        stock: Number(f.stock.replace(/[^\d]/g, "") || 0),
        sizes: splitList(f.sizes),
        tags: splitList(f.tags),
      };
      const res = initial
        ? await api<{ product: ProductRecord }>(`/admin/products/${encodeURIComponent(initial.id)}`, { method: "PUT", body: payload })
        : await api<{ product: ProductRecord }>("/admin/products", { method: "POST", body: payload });
      router.replace(`/admin/products/${res.product.id}`);
      router.refresh();
      if (!initial) return;
      setF(toForm(res.product));
    } catch (err) {
      setError(errorMessage(err, "ذخیره ناموفق بود"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial) return;
    const ok = await confirmDialog({ title: "حذف محصول؟", message: "این عمل قابل بازگشت نیست.", confirmLabel: "حذف", danger: true });
    if (!ok) return;
    try {
      await api(`/admin/products/${encodeURIComponent(initial.id)}`, { method: "DELETE" });
      router.replace("/admin/products");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "حذف ناموفق بود"));
    }
  };

  return (
    <form onSubmit={save} className="max-w-5xl mx-auto space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#111]">
        <ArrowRight className="h-3.5 w-3.5" />
        بازگشت به محصولات
      </Link>
      <AdminPageHeader
        title={initial ? `ویرایش «${initial.name}»` : "محصول جدید"}
        description={initial ? `شناسه: ${initial.id}` : "اطلاعات محصول را وارد کنید"}
        actions={
          <div className="flex gap-2">
            {initial && (
              <AdminButton type="button" variant="danger" onClick={remove}>
                <Trash2 className="h-4 w-4" />
                حذف
              </AdminButton>
            )}
            <AdminButton type="submit" variant="primary" loading={saving}>
              ذخیره
            </AdminButton>
          </div>
        }
      />

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className={card}>
            <label className="block">
              <span className={label}>نام محصول</span>
              <AdminInput
                value={f.name}
                required
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!slugTouched) set("slug", slugFromName(e.target.value).slice(1));
                }}
              />
            </label>
            <label className="block">
              <span className={label}>اسلاگ (آدرس)</span>
              <AdminInput
                value={f.slug}
                dir="ltr"
                className="font-mono text-left"
                required
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
              />
            </label>
            <label className="block">
              <span className={label}>توضیحات</span>
              <textarea
                value={f.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-[#E8E8E8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#111]/10"
              />
            </label>
          </section>

          <section className={card}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111]">تصاویر</h2>
              <MediaPickerButton onPick={(url) => set("images", [...f.images, url])} />
            </div>
            {f.images.length === 0 && <p className="text-xs text-[#A3A3A3]">هنوز تصویری اضافه نشده است.</p>}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {f.images.map((src, i) => (
                <div key={`${src}-${i}`} className="relative rounded-xl overflow-hidden border border-[#E8E8E8] bg-[#F7F7F7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-28 w-full object-cover" />
                  {i === 0 && <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">اصلی</span>}
                  <button
                    type="button"
                    aria-label="حذف تصویر"
                    onClick={() => set("images", f.images.filter((_, j) => j !== i))}
                    className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white/90 inline-flex items-center justify-center"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={card}>
            <h2 className="text-sm font-bold text-[#111]">تنوع‌ها</h2>
            <label className="block">
              <span className={label}>سایزها (با ویرگول جدا کنید)</span>
              <AdminInput value={f.sizes} onChange={(e) => set("sizes", e.target.value)} />
            </label>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={label}>رنگ‌ها</span>
                <button type="button" className="text-xs font-semibold inline-flex items-center gap-1" onClick={() => set("colors", [...f.colors, { name: "", hex: "#000000" }])}>
                  <Plus className="h-3.5 w-3.5" /> افزودن رنگ
                </button>
              </div>
              <div className="space-y-2">
                {f.colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={c.hex}
                      onChange={(e) => set("colors", f.colors.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))}
                      className="h-10 w-12 rounded-lg border border-[#E8E8E8]"
                      aria-label="رنگ"
                    />
                    <AdminInput
                      value={c.name}
                      placeholder="نام رنگ"
                      onChange={(e) => set("colors", f.colors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                    />
                    <button type="button" aria-label="حذف رنگ" className="h-10 w-10 shrink-0 inline-flex items-center justify-center text-[#A3A3A3] hover:text-red-600" onClick={() => set("colors", f.colors.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className={card}>
            <label className="block">
              <span className={label}>وضعیت</span>
              <select value={f.status} onChange={(e) => set("status", e.target.value as Form["status"])} className="w-full h-11 rounded-xl border border-[#E8E8E8] px-3 text-sm bg-white">
                <option value="active">فعال (نمایش در فروشگاه)</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">بایگانی</option>
              </select>
            </label>
            <label className="block">
              <span className={label}>قیمت (تومان)</span>
              <AdminInput value={f.price} inputMode="numeric" dir="ltr" required onChange={(e) => set("price", e.target.value)} />
            </label>
            <label className="block">
              <span className={label}>قیمت قبل از تخفیف (اختیاری)</span>
              <AdminInput value={f.compareAtPrice} inputMode="numeric" dir="ltr" onChange={(e) => set("compareAtPrice", e.target.value)} />
            </label>
            <label className="block">
              <span className={label}>موجودی</span>
              <AdminInput value={f.stock} inputMode="numeric" dir="ltr" onChange={(e) => set("stock", e.target.value)} />
            </label>
          </section>

          <section className={card}>
            <label className="block">
              <span className={label}>دسته‌بندی</span>
              <select value={f.category} onChange={(e) => set("category", e.target.value)} className="w-full h-11 rounded-xl border border-[#E8E8E8] px-3 text-sm bg-white">
                <option value="">—</option>
                {categories.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={label}>جنسیت</span>
              <select value={f.gender} onChange={(e) => set("gender", e.target.value as Form["gender"])} className="w-full h-11 rounded-xl border border-[#E8E8E8] px-3 text-sm bg-white">
                <option value="unisex">یونیسکس</option>
                <option value="men">مردانه</option>
                <option value="women">زنانه</option>
              </select>
            </label>
            <label className="block">
              <span className={label}>برند</span>
              <AdminInput value={f.brand} onChange={(e) => set("brand", e.target.value)} />
            </label>
            <label className="block">
              <span className={label}>برچسب‌ها</span>
              <AdminInput value={f.tags} onChange={(e) => set("tags", e.target.value)} />
            </label>
            {(
              [
                ["featured", "محصول ویژه"],
                ["newArrival", "جدید"],
                ["freeShipping", "ارسال رایگان"],
              ] as const
            ).map(([k, t]) => (
              <label key={k} className="flex items-center gap-2 text-sm text-[#111]">
                <input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} className="h-4 w-4" />
                {t}
              </label>
            ))}
          </section>
        </div>
      </div>
    </form>
  );
}
