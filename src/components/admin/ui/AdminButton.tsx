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
    "bg-[#E31B23] text-white hover:bg-[#C4161D] border border-transparent",
  secondary:
    "bg-white text-[#111] border border-[#E8E8E8] hover:bg-[#F7F7F7]",
  ghost:
    "bg-transparent text-[#737373] hover:bg-[#F7F7F7] hover:text-[#111] border border-transparent",
  danger:
    "bg-[#FEF2F2] text-[#E31B23] hover:bg-[#FEE2E2] border border-transparent",
  icon:
    "bg-transparent text-[#737373] hover:bg-[#F7F7F7] hover:text-[#111] border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-11 px-5 text-sm gap-2 rounded-xl",
};

const AdminButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-colors duration-150 disabled:opacity-45 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(227,27,35,0.25)]",
        variants[variant],
        variant === "icon" ? "h-9 w-9 rounded-lg p-0" : sizes[size],
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
