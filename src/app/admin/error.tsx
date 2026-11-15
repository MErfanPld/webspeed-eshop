"use client";

/**
 * Shown when a server component fails, most often because the Django API is
 * unreachable (API_INTERNAL_URL) — instead of a blank 500 page.
 * (In production Next.js hides server error messages, so the text is generic.)
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4 py-16 text-center" dir="rtl">
      <p className="text-lg font-bold">بارگذاری صفحه ناموفق بود</p>
      <p className="text-sm text-muted-foreground max-w-md">
        ممکن است سرور API در دسترس نباشد. چند لحظه بعد دوباره تلاش کنید.
      </p>
      {error.digest && <p className="text-[11px] text-muted-foreground font-mono" dir="ltr">ref: {error.digest}</p>}
      <button type="button" onClick={reset} className="mt-2 h-10 px-5 bg-foreground text-background text-sm font-medium">
        تلاش دوباره
      </button>
    </div>
  );
}
