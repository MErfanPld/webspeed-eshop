import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "@/types/api";
import { formatNumber } from "@/lib/utils";

/** Server-rendered pagination links (?page=). Hidden when there is one page. */
export default function Pager({ pagination, hrefFor }: { pagination: Pagination; hrefFor: (page: number) => string }) {
  const { page, pages, total } = pagination;
  if (pages <= 1) return null;
  const cls = "h-9 px-3 rounded-lg border border-[#E8E8E8] bg-white inline-flex items-center gap-1 text-sm hover:bg-[#F7F7F7]";
  return (
    <nav className="flex items-center justify-between gap-3" aria-label="صفحه‌بندی">
      <span className="text-xs text-[#737373]">
        صفحه {formatNumber(page)} از {formatNumber(pages)} · {formatNumber(total)} مورد
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <Link href={hrefFor(page - 1)} className={cls} rel="prev">
            <ChevronRight className="h-4 w-4" /> قبلی
          </Link>
        )}
        {page < pages && (
          <Link href={hrefFor(page + 1)} className={cls} rel="next">
            بعدی <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}
