import CouponsManager from "@/components/admin/marketing/CouponsManager";
import { adminApi } from "@/lib/api/admin";
import type { Coupon } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const { coupons } = await adminApi<{ coupons: Coupon[] }>("/admin/coupons");
  return <CouponsManager coupons={coupons} />;
}
