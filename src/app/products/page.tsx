"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import Container from "@/components/ui/Container";
import ProductGrid from "@/components/products/ProductGrid";
import FilterSidebar, {
  type FiltersState,
} from "@/components/products/FilterSidebar";
import SortSelect from "@/components/products/SortSelect";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { products } from "@/data/products";
import { formatNumber } from "@/lib/utils";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    category: "all",
    gender: "all",
    sizes: [],
    colors: [],
    brands: [],
    priceMin: 0,
    priceMax: 0,
  });

  useEffect(() => {
    const cat = searchParams.get("category");
    const gender = searchParams.get("gender");
    const sortParam = searchParams.get("sort");
    if (cat) setFilters((f) => ({ ...f, category: cat }));
    if (gender) setFilters((f) => ({ ...f, gender }));
    if (sortParam) setSort(sortParam);
  }, [searchParams]);

  const query = searchParams.get("q")?.trim().toLowerCase() || "";

  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }
    if (filters.category && filters.category !== "all") {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.gender && filters.gender !== "all") {
      list = list.filter((p) => p.gender === filters.gender);
    }
    if (filters.sizes.length > 0) {
      list = list.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    }
    if (filters.colors.length > 0) {
      list = list.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c.name))
      );
    }
    if (filters.brands.length > 0) {
      list = list.filter((p) => p.brand && filters.brands.includes(p.brand));
    }
    if (filters.priceMin > 0) {
      list = list.filter((p) => p.price >= filters.priceMin);
    }
    if (filters.priceMax > 0) {
      list = list.filter((p) => p.price <= filters.priceMax);
    }
    switch (sort) {
      case "newest":
        list = [...list.filter((p) => p.newArrival), ...list.filter((p) => !p.newArrival)];
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "bestseller":
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        list = [...list.filter((p) => p.featured), ...list.filter((p) => !p.featured)];
    }
    return list;
  }, [filters, sort, query]);

  return (
    <Container className="py-6 sm:py-10">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "محصولات" }]} />
      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">محصولات</h1>
          <p className="mt-1 text-xs text-muted-foreground num" data-num>
            {formatNumber(filtered.length)} کالا
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 h-9 px-3 border border-border rounded-lg text-xs"
          >
            <SlidersHorizontal className="h-4 w-4" />
            فیلتر
          </button>
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>
      <div className="flex gap-8 lg:gap-10">
        <div className="hidden lg:block w-56 shrink-0 border border-border rounded-lg p-4 h-fit sticky top-28">
          <FilterSidebar filters={filters} onChange={setFilters} availableColors={availableColors} />
        </div>
        <div className="flex-1 min-w-0">
          <ProductGrid products={filtered} />
        </div>
      </div>
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-surface overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface">
              <span className="font-semibold text-sm">فیلترها</span>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="p-2" aria-label="بستن">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar filters={filters} onChange={setFilters} availableColors={availableColors} />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Container className="py-20 text-center text-sm text-muted-foreground">در حال بارگذاری...</Container>}>
      <ProductsContent />
    </Suspense>
  );
}
