"use client";

import { useMemo, useState } from "react";
import { mockCustomers } from "@/data/admin";
import { formatPrice, formatNumber } from "@/lib/utils";
import { Users, Search } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminInput from "@/components/admin/ui/AdminInput";

export default function AdminCustomersPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return mockCustomers;
    const s = q.trim().toLowerCase();
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.phone.includes(s)
    );
  }, [q]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="\u0645\u0634\u062a\u0631\u06cc\u200c\u0647\u0627"
        description={`${formatNumber(mockCustomers.length)} \u0645\u0634\u062a\u0631\u06cc`}
      />

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
        <AdminInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="\u062c\u0633\u062a\u062c\u0648..."
          className="pr-9"
        />
      </div>

      {!filtered.length ? (
        <AdminEmptyState
          icon={<Users className="h-5 w-5" />}
          title="\u0645\u0634\u062a\u0631\u06cc\u200c\u0627\u06cc \u06cc\u0627\u0641\u062a \u0646\u0634\u062f"
          description="\u0639\u0628\u0627\u0631\u062a \u062c\u0633\u062a\u062c\u0648 \u0631\u0627 \u062a\u063a\u06cc\u06cc\u0631 \u062f\u0647\u06cc\u062f."
        />
      ) : (
        <div className="rounded-2xl border border-[#E8E8E8] bg-white overflow-hidden">
          <div className="md:hidden divide-y divide-[#F0F0F0]">
            {filtered.map((c) => (
              <div key={c.id} className="p-4 flex gap-3 items-center">
                <div className="h-10 w-10 rounded-full bg-[#111] text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#111]">{c.name}</p>
                  <p className="text-xs text-[#737373] truncate">{c.email}</p>
                  <div className="mt-1.5 flex gap-1.5 items-center">
                    <AdminBadge tone="neutral">{c.orders} \u0633\u0641\u0627\u0631\u0634</AdminBadge>
                    <span className="text-[11px] text-[#525252] tabular-nums">{formatPrice(c.totalSpent)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA] text-[11px] text-[#737373]">
                  <th className="font-semibold px-5 py-3">\u0645\u0634\u062a\u0631\u06cc</th>
                  <th className="font-semibold px-3 py-3">\u0645\u0648\u0628\u0627\u06cc\u0644</th>
                  <th className="font-semibold px-3 py-3">\u0633\u0641\u0627\u0631\u0634\u200c\u0647\u0627</th>
                  <th className="font-semibold px-3 py-3">\u0645\u062c\u0645\u0648\u0639 \u062e\u0631\u06cc\u062f</th>
                  <th className="font-semibold px-5 py-3">\u0639\u0636\u0648\u06cc\u062a</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#111] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#111]">{c.name}</p>
                          <p className="text-[11px] text-[#A3A3A3] truncate">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-[#525252] tabular-nums dir-ltr text-right">{c.phone}</td>
                    <td className="px-3 py-3.5">
                      <AdminBadge tone="neutral">{c.orders}</AdminBadge>
                    </td>
                    <td className="px-3 py-3.5 tabular-nums font-medium text-[#111]">{formatPrice(c.totalSpent)}</td>
                    <td className="px-5 py-3.5 tabular-nums text-[#525252]">{c.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
