"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";
import type { PlatformPlan } from "@/lib/platform";
import { api, ApiError, errorMessage } from "@/lib/api/client";
import { cn, formatNumber } from "@/lib/utils";

type Result = { store: { name: string; slug: string; url: string | null; adminUrl: string | null } };

/** Persian/Latin store name → a suggested subdomain */
function suggest(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export default function SignupForm({
  plans,
  initialPlan,
  suffix,
  panelUrl,
  trialDays,
}: {
  plans: PlatformPlan[];
  initialPlan?: string;
  suffix: string;
  panelUrl: string;
  trialDays: number;
}) {
  const [form, setForm] = useState({
    storeName: "",
    subdomain: "",
    name: "",
    email: "",
    password: "",
    plan: plans.some((p) => p.slug === initialPlan) ? initialPlan! : plans.find((p) => p.highlighted)?.slug ?? plans[0]?.slug ?? "",
  });
  const [subTouched, setSubTouched] = useState(false);
  const [check, setCheck] = useState<{ state: "idle" | "checking" | "ok" | "bad"; reason?: string }>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Result | null>(null);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  // Live availability check (debounced)
  useEffect(() => {
    const name = form.subdomain;
    if (!name) return setCheck({ state: "idle" });
    setCheck({ state: "checking" });
    const t = setTimeout(async () => {
      try {
        const r = await api<{ available: boolean; reason: string | null }>(
          `/platform/check-subdomain?name=${encodeURIComponent(name)}`,
          { refresh: false, redirectOnExpire: false }
        );
        setCheck(r.available ? { state: "ok" } : { state: "bad", reason: r.reason ?? "" });
      } catch {
        setCheck({ state: "idle" });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [form.subdomain]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setErrors({});
    try {
      setDone(await api<Result>("/platform/signup", { method: "POST", body: form, refresh: false, redirectOnExpire: false }));
    } catch (err) {
      if (err instanceof ApiError && err.details && typeof err.details === "object") setErrors(err.details as Record<string, string>);
      setError(errorMessage(err, "ثبت‌نام ناموفق بود"));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="mt-10 rounded-3xl border border-[#d1fae5] bg-[#f0fdf4] p-8 text-center" role="status">
        <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
        <h2 className="mt-4 text-2xl font-extrabold">فروشگاه «{done.store.name}» ساخته شد</h2>
        <p className="mt-2 text-[#475569] leading-7">
          {formatNumber(trialDays)} روز استفاده رایگان شما شروع شد. با همان ایمیل و رمز وارد پنل فروشگاه شوید.
        </p>
        {done.store.url && (
          <p className="mt-4 font-mono text-sm" dir="ltr">
            {done.store.url.replace(/^https?:\/\//, "")}
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a href={done.store.adminUrl ?? panelUrl} className="h-12 px-6 rounded-xl bg-[#0f172a] text-white font-bold inline-flex items-center justify-center gap-2">
            ورود به پنل فروشگاه <ExternalLink className="h-4 w-4" />
          </a>
          {done.store.url && (
            <a href={done.store.url} className="h-12 px-6 rounded-xl bg-white border border-[#e2e8f0] font-bold inline-flex items-center justify-center">
              مشاهده فروشگاه
            </a>
          )}
        </div>
      </div>
    );
  }

  const input = (bad?: string) =>
    cn(
      "w-full h-12 rounded-xl border bg-white px-4 text-sm outline-none focus:ring-4 focus:ring-[#0f172a]/5",
      bad ? "border-red-300" : "border-[#e2e8f0] focus:border-[#0f172a]/40"
    );
  const field = (k: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="block text-sm font-semibold mb-1.5">{label}</span>
      <input name={k} value={form[k]} onChange={(e) => set(k, e.target.value)} className={input(errors[k])} aria-invalid={!!errors[k]} {...props} />
      {errors[k] && <span className="block text-xs text-red-600 mt-1">{errors[k]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} className="mt-10 space-y-5" noValidate>
      {field("storeName", "نام فروشگاه", {
        required: true,
        placeholder: "مثلاً پوشاک آرین",
        onChange: (e) => {
          set("storeName", e.target.value);
          if (!subTouched) set("subdomain", suggest(e.target.value));
        },
      })}

      <label className="block">
        <span className="block text-sm font-semibold mb-1.5">آدرس فروشگاه</span>
        <div className={cn("flex items-center rounded-xl border bg-white overflow-hidden focus-within:ring-4 focus-within:ring-[#0f172a]/5", errors.subdomain || check.state === "bad" ? "border-red-300" : "border-[#e2e8f0]")} dir="ltr">
          <input
            name="subdomain"
            value={form.subdomain}
            onChange={(e) => {
              setSubTouched(true);
              set("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
            }}
            placeholder="myshop"
            className="flex-1 min-w-0 h-12 px-4 text-sm outline-none font-mono"
            aria-describedby="subdomain-status"
            required
          />
          <span className="px-3 text-sm text-[#64748b] bg-[#f8fafc] h-12 inline-flex items-center border-l border-[#e2e8f0] font-mono">{suffix}</span>
        </div>
        <span id="subdomain-status" className="flex items-center gap-1 text-xs mt-1 min-h-4" aria-live="polite">
          {check.state === "checking" && <><Loader2 className="h-3 w-3 animate-spin" /> در حال بررسی...</>}
          {check.state === "ok" && <span className="text-emerald-700 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> این آدرس آزاد است</span>}
          {check.state === "bad" && <span className="text-red-600 inline-flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> {check.reason}</span>}
          {errors.subdomain && check.state !== "bad" && <span className="text-red-600">{errors.subdomain}</span>}
        </span>
      </label>

      <div className="grid sm:grid-cols-2 gap-5">
        {field("name", "نام و نام خانوادگی", { required: true, autoComplete: "name" })}
        {field("email", "ایمیل", { type: "email", required: true, dir: "ltr", autoComplete: "email" })}
      </div>
      {field("password", "رمز عبور (حداقل ۸ کاراکتر)", { type: "password", required: true, minLength: 8, autoComplete: "new-password" })}

      <fieldset>
        <legend className="block text-sm font-semibold mb-2">پلن</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {plans.map((p) => (
            <label
              key={p.slug}
              className={cn(
                "rounded-xl border p-3 cursor-pointer transition",
                form.plan === p.slug ? "border-[#7c3aed] bg-[#faf5ff] ring-2 ring-[#7c3aed]/15" : "border-[#e2e8f0] hover:bg-[#f8fafc]"
              )}
            >
              <input type="radio" name="plan" value={p.slug} checked={form.plan === p.slug} onChange={() => set("plan", p.slug)} className="sr-only" />
              <span className="block font-bold text-sm">{p.name}</span>
              <span className="block text-xs text-[#64748b] mt-0.5 tabular-nums">{formatNumber(p.priceMonthly)} تومان / ماه</span>
            </label>
          ))}
        </div>
        {errors.plan && <span className="block text-xs text-red-600 mt-1">{errors.plan}</span>}
      </fieldset>

      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      <button type="submit" disabled={busy || check.state === "bad"} className="w-full h-13 py-3.5 rounded-xl bg-gradient-to-l from-[#7c3aed] to-[#db2777] text-white font-bold shadow-lg shadow-[#7c3aed]/25 hover:opacity-95 disabled:opacity-60">
        {busy ? "در حال ساخت فروشگاه..." : `ساخت فروشگاه و شروع ${formatNumber(trialDays)} روز رایگان`}
      </button>
      <p className="text-center text-sm text-[#64748b]">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <a href={panelUrl} className="font-semibold text-[#0f172a] underline underline-offset-4">ورود به پنل</a>
      </p>
    </form>
  );
}
