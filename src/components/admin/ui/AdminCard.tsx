"use client";

import { cn } from "@/lib/utils";

export default function AdminCard({
  children,
  className,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white border border-[#E8E8E8] rounded-2xl",
        padding && "p-5 sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
