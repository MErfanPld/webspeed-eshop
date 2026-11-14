"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import { api, errorMessage } from "@/lib/api/client";
import { COLOR_LABELS, DEFAULT_THEME, type StoreTheme, type ThemeColors } from "@/lib/theme/theme";

type ColorKey = keyof ThemeColors;

/** Store theme: storefront colors and typography (saved in the API store settings) */
export default function ThemeForm({ initial, canEdit }: { initial: StoreTheme | null; canEdit: boolean }) {
  const router = useRouter();
  const [colors, setColors] = useState<Required<ThemeColors>>({ ...DEFAULT_THEME.colors, ...(initial?.colors ?? {}) });
  const [typography, setTypography] = useState({ ...DEFAULT_THEME.typography, ...(initial?.typography ?? {}) });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const save = async (theme: StoreTheme | null) => {
    setBusy(true);
    setMsg(null);
    try {
      await api("/admin/store", { method: "PATCH", body: { settings: { theme } } });
      setMsg({ ok: true, text: theme ? "تم ذخیره شد و روی فروشگاه اعمال شد" : "تم به حالت پیش‌فرض برگشت" });
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e, "ذخیره تم ناموفق بود") });
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setColors({ ...DEFAULT_THEME.colors });
    setTypography({ ...DEFAULT_THEME.typography });
    void save(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
      <AdminPageHeader
        title="تنظیمات تم"
        description="رنگ‌ها و تایپوگرافی فروشگاه. تغییرات روی فروشگاه و پیش‌نمایش صفحه‌ساز اعمال می‌شود."
        actions={
          canEdit ? (
            <div className="flex gap-2">
              <AdminButton type="button" onClick={reset} disabled={busy}>
                بازگشت به پیش‌فرض
              </AdminButton>
              <AdminButton type="button" variant="primary" loading={busy} onClick={() => save({ colors, typography })}>
                ذخیره تم
              </AdminButton>
            </div>
          ) : undefined
        }
      />
      {msg && (
        <p role="status" className={`text-sm rounded-xl px-4 py-3 ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </p>
      )}

      <section className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#111]">رنگ‌ها</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {(Object.keys(COLOR_LABELS) as ColorKey[]).map((key) => (
            <label key={key} className="flex items-center gap-3">
              <input
                type="color"
                value={colors[key]}
                disabled={!canEdit}
                onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value }))}
                className="h-10 w-12 rounded-lg border border-[#E5E5E5] cursor-pointer"
                aria-label={COLOR_LABELS[key]}
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-[#111]">{COLOR_LABELS[key]}</span>
                <span className="block text-xs text-[#777] font-mono" dir="ltr">
                  {colors[key]}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#111]">تایپوگرافی</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-[#555]">اندازه پایه فونت (px، ۱۲ تا ۲۲)</span>
            <input
              type="number"
              min={12}
              max={22}
              disabled={!canEdit}
              value={typography.baseSize}
              onChange={(e) => setTypography((t) => ({ ...t, baseSize: Number(e.target.value) || 16 }))}
              className="w-full h-11 px-3 rounded-xl border border-[#E5E5E5] text-sm"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-[#555]">ارتفاع خط (۱٫۲ تا ۲٫۲)</span>
            <input
              type="number"
              step="0.05"
              min={1.2}
              max={2.2}
              disabled={!canEdit}
              value={typography.lineHeight}
              onChange={(e) => setTypography((t) => ({ ...t, lineHeight: Number(e.target.value) || 1.6 }))}
              className="w-full h-11 px-3 rounded-xl border border-[#E5E5E5] text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E5E5] p-5 space-y-3" style={{ background: colors.background, color: colors.foreground }}>
        <p className="text-xs" style={{ color: colors.mutedForeground }}>
          پیش‌نمایش
        </p>
        <div className="rounded-xl p-4 border" style={{ background: colors.surface, borderColor: colors.border }}>
          <p className="font-bold" style={{ fontSize: typography.baseSize * 1.25 }}>
            عنوان نمونه
          </p>
          <p style={{ fontSize: typography.baseSize, lineHeight: typography.lineHeight, color: colors.mutedForeground }}>
            این یک متن نمونه برای نمایش رنگ‌ها و تایپوگرافی فروشگاه است.
          </p>
          <div className="mt-3 flex gap-2">
            <span className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: colors.primary }}>
              دکمه اصلی
            </span>
            <span className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: colors.accent }}>
              دکمه تأکیدی
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
