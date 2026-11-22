"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  ["#features", "امکانات"],
  ["#roadmap", "نقشه ساخت"],
  ["#video", "ویدیو"],
  ["#pricing", "تعرفه‌ها"],
  ["/blog", "مقالات"],
  ["#faq", "سؤالات"],
] as const;

export default function PlatformHeader({ base, panelUrl, hasVideo }: { base: string; panelUrl: string; hasVideo: boolean }) {
  const links = LINKS.filter(([h]) => h !== "#video" || hasVideo);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const href = (h: string) => (h.startsWith("#") ? `${base}/${h}` : `${base}${h}`);
  return (
    <header className={cn("sticky top-0 z-40 transition", scrolled ? "bg-white/85 backdrop-blur-xl shadow-[0_1px_0_#eef2f6]" : "bg-transparent")}>
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-6">
        <Link href={`${base}/`} className="flex items-center gap-2 font-extrabold text-lg">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#7c3aed] via-[#db2777] to-[#ff9f43] text-white grid place-items-center shadow-lg shadow-[#db2777]/30">
            <Zap className="h-5 w-5 fill-current" />
          </span>
          وب‌اسپید
        </Link>
        <nav className="hidden lg:flex items-center gap-6 text-sm text-[#475569]" aria-label="بخش‌های سایت">
          {links.map(([h, label]) => (
            <a key={h} href={href(h)} className="hover:text-[#7c3aed] transition">{label}</a>
          ))}
        </nav>
        <div className="flex-1" />
        <a href={panelUrl} className="hidden sm:inline text-sm font-medium text-[#475569] hover:text-[#0f172a]">ورود</a>
        <Link href={`${base}/signup`} className="h-10 px-4 rounded-xl bg-gradient-to-l from-[#7c3aed] to-[#db2777] text-white text-sm font-bold inline-flex items-center shadow-lg shadow-[#7c3aed]/25 hover:opacity-95">
          شروع رایگان
        </Link>
        <button type="button" className="lg:hidden h-10 w-10 grid place-items-center rounded-xl hover:bg-black/5" aria-label="منو" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-[#eef2f6] bg-white px-4 py-3 grid gap-1 ws-fade-in" aria-label="منوی موبایل">
          {links.map(([h, label]) => (
            <a key={h} href={href(h)} onClick={() => setOpen(false)} className="h-11 flex items-center px-3 rounded-xl hover:bg-[#f8fafc]">{label}</a>
          ))}
          <a href={panelUrl} className="h-11 flex items-center px-3 rounded-xl hover:bg-[#f8fafc]">ورود به پنل</a>
        </nav>
      )}
    </header>
  );
}
