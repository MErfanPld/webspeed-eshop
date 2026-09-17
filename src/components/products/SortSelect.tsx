"use client";

type SortSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const options = [
  { value: "featured", label: "ویژه" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-sm border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
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
