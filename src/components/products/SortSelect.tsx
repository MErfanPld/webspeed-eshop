"use client";

type SortSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const options = [
  { value: "featured", label: "پیشنهاد ما" },
  { value: "bestseller", label: "پرفروش‌ترین" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 bg-surface border border-border rounded-lg text-xs px-2 focus:outline-none focus:ring-2 focus:ring-[var(--digi-blue)]/30 cursor-pointer"
      aria-label="مرتب‌سازی"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
