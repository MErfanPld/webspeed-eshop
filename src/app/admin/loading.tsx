import Skeleton from "@/components/ui/Skeleton";

/** Instant feedback while an admin page fetches its data */
export default function AdminLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6" aria-busy="true" aria-label="در حال بارگذاری">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
