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
      <p className="type-label text-muted-foreground mb-3">
        سایز{selected ? ` — ${selected}` : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={cn(
              "h-11 min-w-[2.75rem] px-3 text-sm transition-colors duration-200",
              selected === size
                ? "bg-foreground text-background"
                : "bg-transparent text-foreground ring-1 ring-inset ring-border hover:ring-foreground/40"
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
