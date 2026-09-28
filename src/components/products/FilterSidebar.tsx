"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { categories, genders, allSizes, brands } from "@/data/categories";
import { cn } from "@/lib/utils";

export type FiltersState = {
  category: string;
  gender: string;
  sizes: string[];
  colors: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
};

type FilterSidebarProps = {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  availableColors: { name: string; hex: string }[];
  className?: string;
};

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/70 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3.5 text-[13px] font-semibold"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

const genderList = genders ?? [];
const sizeList = allSizes ?? [];
const brandList = brands ?? [];

export default function FilterSidebar({
  filters,
  onChange,
  availableColors,
  className,
}: FilterSidebarProps) {
  const toggleSize = (size: string) => {
    const sizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes });
  };

  const toggleColor = (color: string) => {
    const colors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors });
  };

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: next });
  };

  const activeCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.gender !== "all" ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    filters.brands.length +
    (filters.priceMin > 0 || filters.priceMax > 0 ? 1 : 0);

  return (
    <aside className={cn("text-sm", className)}>
      {activeCount > 0 && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">{activeCount} فیلتر فعال</span>
          <button
            type="button"
            onClick={() =>
              onChange({
                category: "all",
                gender: "all",
                sizes: [],
                colors: [],
                brands: [],
                priceMin: 0,
                priceMax: 0,
              })
            }
            className="text-xs font-medium text-foreground underline-offset-2 hover:underline"
          >
            پاک کردن
          </button>
        </div>
      )}

      <Section title="دسته‌بندی">
        <ul className="space-y-1.5">
          {(categories ?? []).map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onChange({ ...filters, category: cat.slug })}
                className={cn(
                  "text-[13px] transition-colors",
                  filters.category === cat.slug
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="جنسیت">
        <ul className="space-y-1.5">
          {genderList.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => onChange({ ...filters, gender: g.id })}
                className={cn(
                  "text-[13px] transition-colors",
                  filters.gender === g.id
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {g.name}
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="برند">
        <ul className="space-y-1.5">
          {brandList.map((b) => (
            <li key={b}>
              <label className="flex items-center gap-2 cursor-pointer text-[13px]">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(b)}
                  onChange={() => toggleBrand(b)}
                  className="rounded border-border"
                />
                <span
                  className={cn(
                    filters.brands.includes(b)
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {b}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="محدوده قیمت (تومان)">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="از"
            value={filters.priceMin || ""}
            onChange={(e) =>
              onChange({ ...filters, priceMin: Number(e.target.value) || 0 })
            }
            className="w-full h-9 border border-border rounded-lg px-2 text-xs bg-transparent focus:outline-none focus:border-foreground/40"
          />
          <input
            type="number"
            placeholder="تا"
            value={filters.priceMax || ""}
            onChange={(e) =>
              onChange({ ...filters, priceMax: Number(e.target.value) || 0 })
            }
            className="w-full h-9 border border-border rounded-lg px-2 text-xs bg-transparent focus:outline-none focus:border-foreground/40"
          />
        </div>
      </Section>

      <Section title="سایز">
        <div className="flex flex-wrap gap-1.5">
          {sizeList.slice(0, 12).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={cn(
                "h-9 min-w-9 px-2.5 text-xs rounded-md border transition-all",
                filters.sizes.includes(size)
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground/50 text-foreground/80"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </Section>

      <Section title="رنگ">
        <div className="flex flex-wrap gap-2.5">
          {(availableColors ?? []).map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => toggleColor(color.name)}
              title={color.name}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                filters.colors.includes(color.name)
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                  : "ring-1 ring-border hover:scale-105"
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            />
          ))}
        </div>
      </Section>
    </aside>
  );
}
