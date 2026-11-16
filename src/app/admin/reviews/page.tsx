import ReviewsModeration from "@/components/admin/marketing/ReviewsModeration";
import { adminApi } from "@/lib/api/admin";
import type { AdminReview } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "pending" } = await searchParams;
  const qs = status === "all" ? "" : `?status=${encodeURIComponent(status)}`;
  const { reviews } = await adminApi<{ reviews: AdminReview[] }>(`/admin/reviews${qs}`);
  return <ReviewsModeration reviews={reviews} status={status} />;
}
