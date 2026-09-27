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
  primary: "bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] shadow-sm",
  secondary: "bg-[var(--admin-surface)] text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-[var(--admin-muted)]",
  ghost: "bg-transparent text-[var(--admin-text-secondary)] hover:bg-[var(--admin-muted)] hover:text-[var(--admin-text)]",
  danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
  icon: "bg-transparent text-[var(--admin-text-secondary)] hover:bg-[var(--admin-muted)] hover:text-[var(--admin-text)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-[var(--admin-radius-sm)]",
  md: "h-9 px-3.5 text-sm gap-2 rounded-[var(--admin-radius-sm)]",
  lg: "h-11 px-5 text-sm gap-2 rounded-[var(--admin-radius)]",
};

const AdminButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "secondary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/30",
        variants[variant],
        variant === "icon" ? "h-9 w-9 rounded-[var(--admin-radius-sm)] p-0" : sizes[size],
        className
      )}
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
