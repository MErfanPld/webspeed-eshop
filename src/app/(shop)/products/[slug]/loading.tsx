import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <Container className="py-8 sm:py-12" aria-busy="true" aria-label="در حال بارگذاری محصول">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-12" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </Container>
  );
}
