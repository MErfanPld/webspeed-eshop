import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-6", className)}>
      {Icon && (
        <div className="h-12 w-12 rounded-2xl bg-[var(--admin-muted)] flex items-center justify-center mb-4">
          <Icon className="h-5 w-5 text-[var(--admin-text-secondary)]" strokeWidth={1.5} />
        </div>
      )}
      <p className="text-base font-semibold text-[var(--admin-text)]">{title}</p>
      {description && (
        <p className="text-sm text-[var(--admin-text-secondary)] mt-1.5 max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
