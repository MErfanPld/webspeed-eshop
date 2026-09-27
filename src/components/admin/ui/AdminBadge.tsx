import { cn } from "@/lib/utils";

const tones = {
  default: "bg-[var(--admin-muted)] text-[var(--admin-text-secondary)]",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-600",
  accent: "bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]",
};

export default function AdminBadge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
