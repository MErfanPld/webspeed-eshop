"use client";

import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import { Users } from "lucide-react";

export default function AdminCustomersPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader title="مشتری‌ها" description="مدیریت مشتریان فروشگاه" />
      <AdminCard>
        <AdminEmptyState
          icon={Users}
          title="لیست مشتریان"
          description="پس از اتصال به بک‌اند، مشتریان اینجا نمایش داده می‌شوند."
        />
      </AdminCard>
    </div>
  );
}
