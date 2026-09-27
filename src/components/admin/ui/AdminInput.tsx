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
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--admin-text)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-11 px-3.5 rounded-[var(--admin-radius-sm)] border bg-[var(--admin-surface)] text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-secondary)]/60 transition-shadow duration-150",
            "focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/25 focus:border-[var(--admin-accent)]",
            error ? "border-red-300 focus:ring-red-200" : "border-[var(--admin-border)]",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[var(--admin-text-secondary)]">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
AdminInput.displayName = "AdminInput";
export default AdminInput;
