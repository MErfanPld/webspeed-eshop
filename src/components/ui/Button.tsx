import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
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
      "inline-flex items-center justify-center font-medium transition-opacity duration-200 focus-visible:outline-none disabled:opacity-35 disabled:pointer-events-none select-none";

    const variants = {
      primary: "bg-foreground text-background hover:opacity-85",
      secondary: "bg-muted text-foreground hover:opacity-80",
      outline:
        "bg-transparent text-foreground ring-1 ring-inset ring-foreground/25 hover:ring-foreground/50",
      ghost: "bg-transparent text-foreground hover:opacity-60",
      link: "bg-transparent text-foreground underline-offset-4 hover:underline p-0 h-auto min-h-0",
    };

    const sizes = {
      sm: "h-10 min-h-[40px] px-5 text-xs tracking-wide",
      md: "h-12 min-h-[48px] px-7 text-sm tracking-wide",
      lg: "h-14 min-h-[52px] px-9 text-sm tracking-wide",
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
