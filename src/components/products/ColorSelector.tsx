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
      <p className="text-sm font-medium mb-3">
        رنگ {selected && <span className="text-muted-foreground">— {selected}</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => onChange(color.name)}
            title={color.name}
            className={cn(
              "h-9 w-9 rounded-full border-2 transition-all",
              selected === color.name
                ? "border-foreground scale-110"
                : "border-transparent hover:scale-105"
            )}
            style={{ backgroundColor: color.hex }}
            aria-label={color.name}
          />
        ))}
      </div>
    </div>
  );
}
