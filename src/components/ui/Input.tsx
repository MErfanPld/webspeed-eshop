import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label htmlFor={id} className="block text-xs font-bold text-foreground/80">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "flex h-12 w-full rounded-xl bg-surface px-4 py-2 text-sm text-foreground",
            "border border-border shadow-[0_1px_2px_rgba(30,27,46,0.04)]",
            "placeholder:text-muted-foreground/60",
            "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all",
            "disabled:opacity-40",
            error && "border-error focus:border-error focus:ring-error/10",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
