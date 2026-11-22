"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/utils";

/**
 * Server HTML has the real number (search engines, no-JS). In the browser, a
 * number still below the fold counts up when it scrolls into view.
 */
function Count({ to }: { to: number }) {
  const [n, setN] = useState(to);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible: no jump
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1200);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} className="tabular-nums">{formatNumber(n)}</span>;
}

export default function StatsCounter({ stats }: { stats: { stores: number; products: number; orders: number } }) {
  const items = [
    { label: "فروشگاه فعال", value: stats.stores, color: "from-[#ff6b6b] to-[#ff9f43]" },
    { label: "محصول در فروشگاه‌ها", value: stats.products, color: "from-[#7c3aed] to-[#c084fc]" },
    { label: "سفارش ثبت‌شده", value: stats.orders, color: "from-[#0ea5e9] to-[#22d3ee]" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-6" data-testid="platform-stats">
      {items.map((s) => (
        <div key={s.label} className="rounded-2xl bg-white/70 backdrop-blur border border-white shadow-sm px-3 py-4 sm:p-6 text-center">
          <p className={`text-2xl sm:text-4xl font-extrabold bg-gradient-to-l ${s.color} bg-clip-text text-transparent`}>
            <Count to={s.value} />
          </p>
          <p className="mt-1 text-[11px] sm:text-sm text-[#475569]">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
