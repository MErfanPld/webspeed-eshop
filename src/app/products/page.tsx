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
import { products } from "@/data/products";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    category: "all",
    gender: "all",
    sizes: [],
    colors: [],
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

  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) =>
      p.colors.forEach((c) => map.set(c.name, c.hex))
    );
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.category && filters.category !== "all") {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.gender && filters.gender !== "all") {
      list = list.filter((p) => p.gender === filters.gender);
    }
    if (filters.sizes.length > 0) {
      list = list.filter((p) =>
        p.sizes.some((s) => filters.sizes.includes(s))
      );
    }
    if (filters.colors.length > 0) {
      list = list.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c.name))
      );
    }
    if (filters.priceMin > 0) {
      list = list.filter((p) => p.price >= filters.priceMin);
    }
    if (filters.priceMax > 0) {
      list = list.filter((p) => p.price <= filters.priceMax);
    }

    switch (sort) {
      case "newest":
        list = list.filter((p) => p.newArrival).concat(
          list.filter((p) => !p.newArrival)
        );
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "featured":
      default:
        list = list.filter((p) => p.featured).concat(
          list.filter((p) => !p.featured)
        );
        break;
    }

    return list;
  }, [filters, sort]);

  return (
    <Container className="py-8 sm:py-12">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          خانه
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">محصولات</span>
      </nav>

      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            محصولات
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatNumber(filtered.length)} محصول
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 h-10 px-3 border border-border rounded-sm text-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            فیلتر
          </button>
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="flex gap-10">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          availableColors={availableColors}
          className="hidden lg:block w-56 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <ProductGrid products={filtered} />
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-background overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
              <span className="font-semibold">فیلترها</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2"
                aria-label="بستن"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                availableColors={availableColors}
              />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Container className="py-20 text-center">در حال بارگذاری...</Container>}>
      <ProductsContent />
    </Suspense>
  );
}
