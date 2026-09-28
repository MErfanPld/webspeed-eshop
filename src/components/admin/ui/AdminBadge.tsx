"use client";

import { cn } from "@/lib/utils";

export default function AdminBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const tones = {
    neutral: "bg-[#F5F5F5] text-[#525252]",
    success: "bg-[#ECFDF5] text-[#047857]",
    warning: "bg-[#FFFBEB] text-[#B45309]",
    danger: "bg-[#FEF2F2] text-[#B91C1C]",
    info: "bg-[#EFF6FF] text-[#1D4ED8]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
