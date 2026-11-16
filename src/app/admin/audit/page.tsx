import Link from "next/link";
import { History } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import Pager from "@/components/admin/ui/Pager";
import { adminApi } from "@/lib/api/admin";
import type { AuditEntry, Pagination } from "@/types/api";

export const dynamic = "force-dynamic";

const ACTIONS: Record<string, string> = {
  "order.status": "تغییر وضعیت سفارش",
  "coupon.create": "ساخت کد تخفیف",
  "coupon.update": "ویرایش کد تخفیف",
  "coupon.delete": "حذف کد تخفیف",
  "brand.delete": "حذف برند",
  "product.delete": "حذف محصول",
  "review.moderate": "بررسی نظر",
  "member.add": "افزودن عضو تیم",
  "member.role": "تغییر نقش عضو",
  "member.remove": "حذف عضو تیم",
};

export default async function AdminAuditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const { logs, pagination } = await adminApi<{ logs: AuditEntry[]; pagination: Pagination }>(`/admin/audit?page=${page}`);
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader title="گزارش فعالیت" description="کارهای حساس اعضای تیم (فقط برای مالک فروشگاه)." />
      {!logs.length ? (
        <AdminEmptyState icon={<History className="h-5 w-5" />} title="هنوز فعالیتی ثبت نشده" />
      ) : (
        <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[#737373] text-xs">
              <tr className="border-b border-[#F0F0F0]">
                <th className="text-right p-3">زمان</th>
                <th className="text-right p-3">کاربر</th>
                <th className="text-right p-3">فعالیت</th>
                <th className="text-right p-3">مورد</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((e) => (
                <tr key={e.id} className="border-b border-[#F7F7F7] last:border-0" data-testid="audit-row">
                  <td className="p-3 whitespace-nowrap text-[#737373]">{new Date(e.createdAt).toLocaleString("fa-IR")}</td>
                  <td className="p-3" dir="ltr">{e.user ?? "—"}</td>
                  <td className="p-3">{ACTIONS[e.action] ?? e.action}</td>
                  <td className="p-3 font-mono text-xs" dir="ltr">
                    {e.target}
                    {typeof e.meta?.status === "string" ? ` → ${e.meta.status}` : ""}
                    {typeof e.meta?.role === "string" ? ` → ${e.meta.role}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pager pagination={pagination} hrefFor={(p) => `/admin/audit?page=${p}`} />
      <p className="text-xs text-[#A3A3A3]">
        <Link href="/admin/team" className="underline">مدیریت اعضای تیم</Link>
      </p>
    </div>
  );
}
