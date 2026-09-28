"use client";

export default function AdminEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E8E8E8] bg-white px-6 py-12 sm:py-16 text-center">
      {icon && (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F7F7] text-[#737373]">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-[#111]">{title}</p>
      {description && (
        <p className="mt-1.5 text-xs text-[#737373] max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
