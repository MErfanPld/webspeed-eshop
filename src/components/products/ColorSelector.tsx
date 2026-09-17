"use client";

import { cn } from "@/lib/utils";
import type { ProductColor } from "@/types/product";

type ColorSelectorProps = {
  colors: ProductColor[];
  selected: string | null;
  onChange: (color: string) => void;
};

export default function ColorSelector({
  colors,
  selected,
  onChange,
}: ColorSelectorProps) {
  return (
    <div>
      <p className="type-label text-muted-foreground mb-3">
        رنگ{selected ? ` — ${selected}` : ""}
      </p>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => onChange(color.name)}
            title={color.name}
            className={cn(
              "h-8 w-8 rounded-full transition-transform duration-200",
              selected === color.name
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105"
                : "ring-1 ring-border"
            )}
            style={{ backgroundColor: color.hex }}
            aria-label={color.name}
          />
        ))}
      </div>
    </div>
  );
}
