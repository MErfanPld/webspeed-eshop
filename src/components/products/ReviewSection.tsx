"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import type { ProductReview } from "@/types/product";
import { formatNumber, cn } from "@/lib/utils";

type Props = {
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
};

const defaultReviews: ProductReview[] = [
  {
    id: "r1",
    user: "علی م.",
    rating: 5,
    comment: "کیفیت پارچه عالی بود، سایز هم دقیق بود. پیشنهاد می‌کنم.",
    date: "۱۴۰۴/۰۶/۱۲",
  },
  {
    id: "r2",
    user: "سارا ا.",
    rating: 4,
    comment: "رنگ کمی با عکس فرق داشت ولی کلی راضی‌ام.",
    date: "۱۴۰۴/۰۵/۲۸",
  },
  {
    id: "r3",
    user: "رضا ک.",
    rating: 5,
    comment: "ارسال سریع و بسته‌بندی مرتب. خرید بعدی هم از همینجا.",
    date: "۱۴۰۴/۰۵/۱۰",
  },
  {
    id: "r4",
    user: "مریم ح.",
    rating: 3,
    comment: "قیمت مناسب است ولی دوخت می‌توانست بهتر باشد.",
    date: "۱۴۰۴/۰۴/۲۲",
  },
  {
    id: "r5",
    user: "حسین ن.",
    rating: 5,
    comment: "از خریدم خیلی راضی‌ام. سایزبندی دقیق و کیفیت عالی.",
    date: "۱۴۰۴/۰۳/۱۸",
  },
];

export default function ReviewSection({
  rating,
  reviewCount,
  reviews,
}: Props) {
  const [list, setList] = useState<ProductReview[]>(
    reviews.length ? reviews : defaultReviews
  );
  const [filter, setFilter] = useState<number | "all">("all");
  const [comment, setComment] = useState("");
  const [myRating, setMyRating] = useState(5);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    list.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1] += 1;
    });
    return dist;
  }, [list]);

  const maxDist = Math.max(...distribution, 1);
  const filtered =
    filter === "all" ? list : list.filter((r) => r.rating === filter);

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const entry: ProductReview = {
      id: `local-${Date.now()}`,
      user: name.trim() || "کاربر",
      rating: myRating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString("fa-IR"),
    };
    setList((prev) => [entry, ...prev]);
    setComment("");
    setName("");
    setMyRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-5 sm:p-6 rounded-2xl border border-border bg-surface">
        <div className="text-center md:text-right space-y-2">
          <p className="text-4xl font-bold num" data-num>
            {(rating || 4.5).toFixed(1)}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(rating || 4.5)
                    ? "fill-amber-400 text-amber-400"
                    : "text-border"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground num" data-num>
            از {formatNumber(Math.max(reviewCount, list.length))} نظر
          </p>
        </div>

        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFilter(filter === star ? "all" : star)}
              className="flex items-center gap-3 w-full group"
            >
              <span className="text-xs w-14 num text-muted-foreground" data-num>
                {star} ستاره
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{
                    width: `${(distribution[star - 1] / maxDist) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-6 num" data-num>
                {formatNumber(distribution[star - 1])}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={submitReview}
        className="rounded-2xl border border-border bg-surface p-5 space-y-4"
      >
        <h3 className="text-sm font-semibold">ثبت نظر شما</h3>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setMyRating(i + 1)}
              className="p-0.5"
              aria-label={`${i + 1} ستاره`}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  i < myRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-border"
                )}
              />
            </button>
          ))}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام شما (اختیاری)"
          className="w-full h-11 rounded-xl border border-border px-3.5 text-sm bg-transparent focus:outline-none focus:border-foreground/40"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="نظر خود را بنویسید..."
          rows={3}
          required
          className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm bg-transparent resize-none focus:outline-none focus:border-foreground/40"
        />
        <button
          type="submit"
          className="h-11 px-5 rounded-xl bg-foreground text-background text-sm font-semibold"
        >
          {submitted ? "ثبت شد ✓" : "ارسال نظر"}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={cn(
            "px-3.5 py-1.5 text-xs rounded-full border transition-colors",
            filter === "all"
              ? "bg-foreground text-background border-foreground"
              : "border-border"
          )}
        >
          همه نظرات
        </button>
        {[5, 4, 3, 2, 1].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "px-3.5 py-1.5 text-xs rounded-full border num transition-colors",
              filter === s
                ? "bg-foreground text-background border-foreground"
                : "border-border"
            )}
          >
            {s} ستاره
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.map((r) => (
          <li
            key={r.id}
            className="border border-border rounded-2xl p-4 sm:p-5 space-y-2.5 bg-surface"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {r.user.charAt(0)}
                </span>
                <span className="text-sm font-medium">{r.user}</span>
              </div>
              <span className="text-[11px] text-muted-foreground num" data-num>
                {r.date}
              </span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < r.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-border"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {r.comment}
            </p>
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            نظری با این امتیاز نیست.
          </p>
        )}
      </ul>
    </div>
  );
}
