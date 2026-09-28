"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const AdminInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm text-[#111] placeholder:text-[#A3A3A3] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(227,27,35,0.15)] focus:border-[#E31B23]/40",
      className
    )}
    style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}
    {...props}
  />
));
AdminInput.displayName = "AdminInput";
export default AdminInput;
