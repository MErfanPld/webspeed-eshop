import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

/** Shown instantly while a storefront page loads (streamed by Next.js) */
export default function ShopLoading() {
  return (
    <Container className="py-8 sm:py-12" aria-busy="true" aria-label="در حال بارگذاری">
      <Skeleton className="h-44 sm:h-72 w-full rounded-2xl mb-8" />
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </Container>
  );
}
