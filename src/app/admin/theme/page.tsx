"use client";

import { useEffect, useState } from "react";
import { DEFAULT_THEME, type ThemeSettings } from "@/builder/theme/design-tokens";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";

const STORAGE_KEY = "webspeed-theme-v1";

export default function AdminThemePage() {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTheme({ ...DEFAULT_THEME, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setColor = (key: keyof ThemeSettings["colors"], value: string) => {
    setTheme((t) => ({ ...t, colors: { ...t.colors, [key]: value } }));
  };

  const colorFields: { key: keyof ThemeSettings["colors"]; label: string }[] = [
    { key: "primary", label: "اصلی" },
    { key: "secondary", label: "ثانویه" },
    { key: "accent", label: "تاکیدی" },
    { key: "background", label: "پس‌زمینه" },
    { key: "surface", label: "سطح" },
    { key: "text", label: "متن" },
    { key: "muted", label: "متن کم‌رنگ" },
    { key: "border", label: "حاشیه" },
    { key: "success", label: "موفق" },
    { key: "warning", label: "هشدار" },
    { key: "error", label: "خطا" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
      <AdminPageHeader
        title="تنظیمات تم"
        description="رنگ‌ها و توکن‌های سراسری فروشگاه. بلوک‌ها می‌توانند از این مقادیر استفاده کنند."
        actions={
          <AdminButton variant="primary" onClick={save}>
            {saved ? "ذخیره شد ✓" : "ذخیره تم"}
          </AdminButton>
        }
      />

      <section className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#111]">رنگ‌ها</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {colorFields.map((f) => (
            <label key={f.key} className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors[f.key] || "#000000"}
                onChange={(e) => setColor(f.key, e.target.value)}
                className="h-10 w-12 rounded-lg border border-[#E5E5E5] cursor-pointer"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-[#111]">{f.label}</span>
                <span className="block text-xs text-[#777] font-mono">{theme.colors[f.key]}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#111]">تایپوگرافی</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-[#555]">اندازه پایه (px)</span>
            <input
              type="number"
              value={theme.typography.baseSize}
              onChange={(e) =>
                setTheme((t) => ({
                  ...t,
                  typography: { ...t.typography, baseSize: Number(e.target.value) || 16 },
                }))
              }
              className="w-full h-11 px-3 rounded-xl border border-[#E5E5E5] text-sm"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-[#555]">ارتفاع خط</span>
            <input
              type="number"
              step="0.05"
              value={theme.typography.lineHeight}
              onChange={(e) =>
                setTheme((t) => ({
                  ...t,
                  typography: { ...t.typography, lineHeight: Number(e.target.value) || 1.5 },
                }))
              }
              className="w-full h-11 px-3 rounded-xl border border-[#E5E5E5] text-sm"
            />
          </label>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#111]">فاصله‌ها</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {(
            [
              ["sectionY", "فاصله عمودی سکشن"],
              ["containerX", "پدینگ افقی"],
              ["gridGap", "فاصله گرید"],
              ["stackGap", "فاصله پشته"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="space-y-1.5">
              <span className="text-xs font-semibold text-[#555]">{label}</span>
              <input
                type="number"
                value={theme.spacing[key]}
                onChange={(e) =>
                  setTheme((t) => ({
                    ...t,
                    spacing: { ...t.spacing, [key]: Number(e.target.value) || 0 },
                  }))
                }
                className="w-full h-11 px-3 rounded-xl border border-[#E5E5E5] text-sm"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
