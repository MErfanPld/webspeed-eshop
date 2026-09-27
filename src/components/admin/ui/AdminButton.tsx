"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "icon";
type Size = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[#5D87FF] text-white hover:bg-[#4570EA] shadow-md shadow-[#5D87FF]/25 border border-transparent",
  secondary:
    "bg-white text-[#2A3547] border border-[#E5EAEF] hover:bg-[#F0F5F9]",
  ghost: "bg-transparent text-[#7C8FAC] hover:bg-[#F0F5F9] hover:text-[#2A3547] border border-transparent",
  danger: "bg-[#FDEDE8] text-[#FA896B] hover:bg-[#FA896B]/20 border border-transparent",
  icon: "bg-transparent text-[#7C8FAC] hover:bg-[#F0F5F9] hover:text-[#2A3547] border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-xs gap-1.5 rounded-xl",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-5 text-sm gap-2 rounded-xl",
};

const AdminButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "secondary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D87FF]/30",
        variants[variant],
        variant === "icon" ? "h-10 w-10 rounded-xl p-0" : sizes[size],
        className
      )}
      style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {children}
    </button>
  )
);
AdminButton.displayName = "AdminButton";
export default AdminButton;
