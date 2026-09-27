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
        "bg-white border border-[var(--admin-border)] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
        padding && "p-5 sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
