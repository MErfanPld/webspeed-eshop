import { Users } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import Pager from "@/components/admin/ui/Pager";
import { adminApi } from "@/lib/api/admin";
import type { CustomerRow, Pagination } from "@/types/api";
import { formatNumber, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Customers derived from orders (grouped by mobile number) */
export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const sp = await searchParams;
  const qs = new URLSearchParams({ page: String(Math.max(1, Number(sp.page) || 1)), pageSize: "50" });
  if (sp.q) qs.set("q", sp.q);
  const { customers, pagination } = await adminApi<{ customers: CustomerRow[]; pagination: Pagination }>(`/admin/customers?${qs}`);
  const hrefFor = (p: number) => `/admin/customers?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), page: String(p) })}`;
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader title="مشتری‌ها" description={`${formatNumber(pagination.total)} مشتری (بر اساس شماره موبایل سفارش‌ها)`} />
      <form className="max-w-sm" action="/admin/customers">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="جستجوی نام یا موبایل + Enter"
          aria-label="جستجوی مشتری"
          className="w-full h-10 rounded-xl border border-[#E8E8E8] bg-white px-3 text-sm"
        />
      </form>
      {!customers.length ? (
        <AdminEmptyState icon={<Users className="h-5 w-5" />} title="هنوز مشتری‌ای ندارید" description="با ثبت اولین سفارش، مشتری‌ها اینجا نمایش داده می‌شوند." />
      ) : (
        <div className="rounded-2xl border border-[#E8E8E8] bg-white overflow-x-auto">
          <table className="w-full text-sm text-right min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA] text-[11px] text-[#737373]">
                <th className="font-semibold px-5 py-3">نام</th>
                <th className="font-semibold px-3 py-3">موبایل</th>
                <th className="font-semibold px-3 py-3">سفارش‌ها</th>
                <th className="font-semibold px-3 py-3">مجموع خرید</th>
                <th className="font-semibold px-5 py-3">آخرین سفارش</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone} className="border-b border-[#F5F5F5] last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-[#111]">{c.name}</p>
                    {c.email && <p className="text-[11px] text-[#A3A3A3]" dir="ltr">{c.email}</p>}
                  </td>
                  <td className="px-3 py-3.5 font-mono text-xs" dir="ltr">{c.phone}</td>
                  <td className="px-3 py-3.5 tabular-nums">{formatNumber(c.orders)}</td>
                  <td className="px-3 py-3.5 tabular-nums">{formatPrice(c.totalSpent)}</td>
                  <td className="px-5 py-3.5 text-xs text-[#525252]">
                    {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(c.lastOrder ?? c.firstOrder))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pager pagination={pagination} hrefFor={hrefFor} />
    </div>
  );
}
