import { cn } from "@/lib/utils";

export default function AdminCard({
  className,
  children,
  padding = true,
}: {
  className?: string;
  children: React.ReactNode;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[var(--admin-radius)] shadow-[var(--admin-shadow)]",
        padding && "p-5 sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
