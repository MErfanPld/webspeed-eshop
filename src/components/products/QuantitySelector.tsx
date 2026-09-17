"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-border rounded-sm w-fit">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-11 w-11 flex items-center justify-center hover:bg-muted disabled:opacity-40"
        aria-label="کاهش تعداد"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-12 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-11 w-11 flex items-center justify-center hover:bg-muted disabled:opacity-40"
        aria-label="افزایش تعداد"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
