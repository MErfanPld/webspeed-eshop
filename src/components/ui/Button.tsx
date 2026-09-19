import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "link";
  size?: "sm" | "md" | "lg";
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none disabled:opacity-35 disabled:pointer-events-none select-none";

    const variants = {
      primary: "bg-foreground text-background hover:opacity-88",
      accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
      secondary: "bg-muted text-foreground hover:opacity-80",
      outline:
        "bg-transparent text-foreground shadow-[inset_0_0_0_1px_var(--foreground)] hover:bg-foreground hover:text-background",
      ghost: "bg-transparent text-foreground hover:opacity-60",
      link: "bg-transparent text-foreground underline-offset-4 hover:underline p-0 h-auto min-h-0 font-medium",
    };

    const sizes = {
      sm: "h-10 min-h-[40px] px-5 text-xs",
      md: "h-12 min-h-[48px] px-7 text-[13px]",
      lg: "h-14 min-h-[52px] px-9 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          variant !== "link" && sizes[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
