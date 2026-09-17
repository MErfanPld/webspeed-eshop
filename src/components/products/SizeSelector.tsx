"use client";

import { cn } from "@/lib/utils";

type SizeSelectorProps = {
  sizes: string[];
  selected: string | null;
  onChange: (size: string) => void;
};

export default function SizeSelector({
  sizes,
  selected,
  onChange,
}: SizeSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium mb-3">
        سایز {selected && <span className="text-muted-foreground">— {selected}</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={cn(
              "h-11 min-w-11 px-3 text-sm border rounded-sm transition-colors",
              selected === size
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground"
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
