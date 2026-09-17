import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
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
      "inline-flex items-center justify-center font-medium tracking-wide transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground disabled:opacity-40 disabled:pointer-events-none select-none";

    const variants = {
      primary: "bg-foreground text-background hover:opacity-90",
      secondary: "bg-muted text-foreground hover:opacity-80",
      outline:
        "border border-foreground/20 bg-transparent text-foreground hover:border-foreground/50",
      ghost: "bg-transparent text-foreground hover:opacity-70",
    };

    const sizes = {
      sm: "h-10 min-h-[40px] px-4 text-xs",
      md: "h-12 min-h-[48px] px-6 text-sm",
      lg: "h-14 min-h-[52px] px-8 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
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
