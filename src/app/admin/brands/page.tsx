import BrandsManager from "@/components/admin/catalog/BrandsManager";
import { adminApi } from "@/lib/api/admin";
import type { Brand } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const { brands } = await adminApi<{ brands: Brand[] }>("/admin/brands");
  return <BrandsManager brands={brands} />;
}
