"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { PlatformPlan } from "@/lib/platform";
import { cn, formatNumber } from "@/lib/utils";

export default function Pricing({ plans, base, trialDays }: { plans: PlatformPlan[]; base: string; trialDays: number }) {
  const [yearly, setYearly] = useState(false);
  return (
    <div>
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1 rounded-xl bg-[#f1f5f9]" role="radiogroup" aria-label="دوره پرداخت">
          {[
            [false, "ماهانه"],
            [true, "سالانه (۲ ماه رایگان)"],
          ].map(([value, label]) => (
            <button
              key={String(value)}
              type="button"
              role="radio"
              aria-checked={yearly === value}
              onClick={() => setYearly(value as boolean)}
              className={cn("h-9 px-4 rounded-lg text-sm font-medium transition", yearly === value ? "bg-white shadow-sm text-[#0f172a]" : "text-[#64748b]")}
            >
              {label as string}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        {plans.map((p) => {
          const price = yearly ? p.priceYearly : p.priceMonthly;
          return (
            <div
              key={p.slug}
              data-plan={p.slug}
              className={cn(
                "relative rounded-3xl border p-7 flex flex-col",
                p.highlighted ? "border-[#0f172a] bg-[#0f172a] text-white shadow-2xl md:-translate-y-3" : "border-[#e2e8f0] bg-white"
              )}
            >
              {p.highlighted && (
                <span className="absolute -top-3 right-7 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-l from-[#e31b23] to-[#ff7a59] text-white">
                  پیشنهاد ما
                </span>
              )}
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className={cn("text-sm mt-1 min-h-10", p.highlighted ? "text-white/70" : "text-[#64748b]")}>{p.tagline}</p>
              <p className="mt-5">
                <span className="text-4xl font-extrabold tabular-nums">{formatNumber(price)}</span>
                <span className={cn("text-sm mr-1", p.highlighted ? "text-white/70" : "text-[#64748b]")}>
                  تومان / {yearly ? "سال" : "ماه"}
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-sm flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className={cn("h-4 w-4 shrink-0 mt-0.5", p.highlighted ? "text-[#ff9d84]" : "text-emerald-600")} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`${base}/signup?plan=${p.slug}`}
                className={cn(
                  "mt-8 h-12 rounded-xl text-sm font-bold inline-flex items-center justify-center transition",
                  p.highlighted ? "bg-white text-[#0f172a] hover:bg-[#f1f5f9]" : "bg-[#0f172a] text-white hover:bg-[#1e293b]"
                )}
              >
                {formatNumber(trialDays)} روز رایگان امتحان کنید
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
