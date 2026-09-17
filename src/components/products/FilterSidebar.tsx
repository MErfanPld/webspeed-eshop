"use client";

import { categories, genders, allSizes } from "@/data/categories";
import { cn } from "@/lib/utils";

export type FiltersState = {
  category: string;
  gender: string;
  sizes: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
};

type FilterSidebarProps = {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  availableColors: { name: string; hex: string }[];
  className?: string;
};

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

  return (
    <aside className={cn("space-y-8", className)}>
      <div>
        <h3 className="text-sm font-semibold mb-3">دسته‌بندی</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() =>
                  onChange({ ...filters, category: cat.slug })
                }
                className={cn(
                  "text-sm transition-colors",
                  filters.category === cat.slug
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">جنسیت</h3>
        <ul className="space-y-2">
          {genders.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => onChange({ ...filters, gender: g.id })}
                className={cn(
                  "text-sm transition-colors",
                  filters.gender === g.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {g.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">سایز</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.slice(0, 12).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={cn(
                "h-9 min-w-9 px-2 text-xs border rounded-sm transition-colors",
                filters.sizes.includes(size)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">رنگ</h3>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => toggleColor(color.name)}
              title={color.name}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all",
                filters.colors.includes(color.name)
                  ? "border-foreground scale-110"
                  : "border-transparent"
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">محدوده قیمت (تومان)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.priceMin || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                priceMin: Number(e.target.value) || 0,
              })
            }
            placeholder="از"
            className="w-full h-10 rounded-sm border border-border px-2 text-sm"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            value={filters.priceMax || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                priceMax: Number(e.target.value) || 0,
              })
            }
            placeholder="تا"
            className="w-full h-10 rounded-sm border border-border px-2 text-sm"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({
            category: "all",
            gender: "all",
            sizes: [],
            colors: [],
            priceMin: 0,
            priceMax: 0,
          })
        }
        className="text-sm text-muted-foreground hover:text-foreground underline"
      >
        پاک کردن فیلترها
      </button>
    </aside>
  );
}
