"use client";

import { categories } from "@/data/categories";
import { Tag, Package } from "lucide-react";

const palette = [
  { bg: "from-[#ECF2FF] to-[#E0EBFF]", icon: "bg-[#5D87FF]", ring: "ring-[#5D87FF]/15" },
  { bg: "from-[#E6FFFA] to-[#D5F7F0]", icon: "bg-[#13DEB9]", ring: "ring-[#13DEB9]/15" },
  { bg: "from-[#FEF5E5] to-[#FCECC8]", icon: "bg-[#FFAE1F]", ring: "ring-[#FFAE1F]/15" },
  { bg: "from-[#FDEDE8] to-[#FCDFD6]", icon: "bg-[#FA896B]", ring: "ring-[#FA896B]/15" },
  { bg: "from-[#F3E8FF] to-[#E9D5FF]", icon: "bg-[#8B5CF6]", ring: "ring-[#8B5CF6]/15" },
  { bg: "from-[#E0F2FE] to-[#BAE6FD]", icon: "bg-[#0EA5E9]", ring: "ring-[#0EA5E9]/15" },
];

export default function AdminCategoriesPage() {
  const list = categories.filter((c) => c.id !== "all");

  return (
    <div className="max-w-[1200px] mx-auto space-y-5" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#2A3547]">دسته‌بندی‌ها</h1>
          <p className="text-sm text-[#7C8FAC] mt-1">{list.length} دسته فعال در فروشگاه</p>
        </div>
        <button type="button" disabled className="h-11 px-5 rounded-xl bg-[#5D87FF] text-white text-sm font-semibold inline-flex items-center gap-2 opacity-70 cursor-not-allowed shadow-md shadow-[#5D87FF]/20">
          <Tag className="h-4 w-4" />
          دسته جدید
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c, i) => {
          const p = palette[i % palette.length];
          return (
            <div
              key={c.id}
              className={`relative overflow-hidden rounded-2xl border border-[#E5EAEF] bg-gradient-to-br ${p.bg} p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow`}
            >
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-2xl ${p.icon} text-white flex items-center justify-center shrink-0 shadow-md ring-4 ${p.ring}`}>
                  <Package className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-[#2A3547]">{c.name}</p>
                  <p className="text-xs text-[#7C8FAC] mt-1 font-mono dir-ltr text-left">/{c.slug}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/80 text-[#13DEB9] border border-[#13DEB9]/20">
                      فعال
                    </span>
                    {c.children && c.children.length > 0 && (
                      <span className="text-[11px] text-[#7C8FAC]">{c.children.length} زیردسته</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
