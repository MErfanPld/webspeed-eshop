"use client";

import { mockOrders, statusLabel } from "@/data/admin";
import { formatPrice } from "@/lib/utils";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import { ShoppingBag } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader
        title="سفارش‌ها"
        description={`${mockOrders.length} سفارش ثبت‌شده`}
      />
      <AdminCard padding={false}>
        {!mockOrders.length ? (
          <AdminEmptyState
            icon={ShoppingBag}
            title="هنوز سفارشی ندارید"
            description="وقتی مشتری خرید کند، سفارش‌ها اینجا نمایش داده می‌شوند."
          />
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {mockOrders.map((o) => (
              <div
                key={o.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-4 hover:bg-[var(--admin-muted)]/40 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{o.customer}</p>
                  <p className="text-xs text-[var(--admin-text-secondary)] mt-0.5 tabular-nums">
                    {o.id} · {o.date}
                  </p>
                </div>
                <AdminBadge
                  tone={
                    o.status === "delivered"
                      ? "success"
                      : o.status === "cancelled"
                        ? "danger"
                        : "default"
                  }
                >
                  {statusLabel[o.status] || o.status}
                </AdminBadge>
                <p className="text-sm font-semibold tabular-nums sm:min-w-[7rem] sm:text-left">
                  {formatPrice(o.total)}
                </p>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
