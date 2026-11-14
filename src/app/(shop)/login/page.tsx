"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Smartphone } from "lucide-react";
import { api, errorMessage } from "@/lib/api/client";

const CODE_LENGTH = 6;

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [devCode, setDevCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNew, setIsNew] = useState(false);

  const normalizePhone = (v: string) => v.replace(/\D/g, "").slice(0, 11);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const p = normalizePhone(phone);
    if (p.length < 10 || !p.startsWith("09")) {
      setError("شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۱۲۳۴۵۶۷)");
      return;
    }
    setLoading(true);
    try {
      const res = await api<{ isNew: boolean; devCode?: string }>("/customer/otp/request", {
        method: "POST",
        body: { phone: p },
        refresh: false,
        redirectOnExpire: false,
      });
      setIsNew(res.isNew);
      setDevCode(res.devCode ?? null);
      setOtp(Array(CODE_LENGTH).fill(""));
      setStep("otp");
    } catch (err) {
      setError(errorMessage(err, "ارسال کد ناموفق بود"));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== CODE_LENGTH) {
      setError("کد ۶ رقمی را کامل وارد کنید");
      return;
    }
    setLoading(true);
    try {
      await api("/customer/otp/verify", {
        method: "POST",
        body: { phone: normalizePhone(phone), code },
        refresh: false,
        redirectOnExpire: false,
      });
      router.push("/profile");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "کد واردشده اشتباه است"));
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < CODE_LENGTH - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-sm font-bold tracking-[0.18em] uppercase inline-block mb-6"
          >
            WebSpeed
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {step === "phone"
              ? "ورود / ثبت‌نام"
              : isNew
                ? "تأیید شماره — ثبت‌نام"
                : "تأیید شماره — ورود"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {step === "phone"
              ? "فقط با شماره موبایل وارد شوید. اگر حساب ندارید، خودکار ساخته می‌شود."
              : `کد تأیید به ${phone} ارسال شد`}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          {step === "phone" ? (
            <form onSubmit={sendCode} className="space-y-5">
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-muted-foreground mb-2">
                  شماره موبایل
                </label>
                <div className="relative">
                  <Smartphone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    placeholder="09121234567"
                    value={phone}
                    onChange={(e) => setPhone(normalizePhone(e.target.value))}
                    className="w-full h-12 rounded-xl border border-border bg-transparent pr-11 pl-4 text-sm num focus:outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/5"
                    autoComplete="tel"
                    autoFocus
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-[var(--discount)]" role="alert">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-60"
              >
                {loading ? "در حال ارسال..." : "دریافت کد تأیید"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-5">
              {devCode && (
                <p className="text-xs text-center text-muted-foreground" data-dev-code>
                  محیط توسعه — کد: <span className="num font-semibold" dir="ltr">{devCode}</span>
                </p>
              )}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-3 text-center">
                  کد ۶ رقمی
                </label>
                <div className="flex justify-center gap-2.5" dir="ltr">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKey(i, e)}
                      className="h-12 w-10 sm:h-14 sm:w-12 text-center text-lg font-semibold rounded-xl border border-border bg-transparent num focus:outline-none focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <p className="text-center text-[11px] text-muted-foreground mt-3">
                  کد تست: هر ۴ رقم (مثلاً ۱۲۳۴)
                </p>
              </div>
              {error && (
                <p className="text-sm text-[var(--discount)] text-center" role="alert">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-60"
              >
                {loading ? "در حال بررسی..." : isNew ? "ثبت‌نام و ورود" : "ورود به حساب"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp(["", "", "", ""]);
                  setError("");
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                تغییر شماره موبایل
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6 leading-relaxed">
          با ادامه،{" "}
          <Link href="/about" className="underline underline-offset-2">
            شرایط استفاده
          </Link>{" "}
          را می‌پذیرید.
        </p>
      </div>
    </div>
  );
}
