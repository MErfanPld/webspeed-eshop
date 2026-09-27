"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

const AdminInput = forwardRef<HTMLInputElement, Props>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label;
    return (
      <div className="space-y-1.5" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-[#2A3547]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-12 px-3.5 rounded-xl border bg-[#F8FAFC] text-sm text-[#2A3547] placeholder:text-[#7C8FAC]/60 transition-shadow",
            "focus:outline-none focus:ring-2 focus:ring-[#5D87FF]/20 focus:border-[#5D87FF]",
            error ? "border-[#FA896B]" : "border-[#E5EAEF]",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[#7C8FAC]">{hint}</p>}
        {error && <p className="text-xs text-[#FA896B] font-medium">{error}</p>}
      </div>
    );
  }
);
AdminInput.displayName = "AdminInput";
export default AdminInput;
