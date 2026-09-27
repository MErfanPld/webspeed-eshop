"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("ایمیل و رمز عبور را وارد کنید.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    router.push("/admin");
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-10"
      style={{
        fontFamily: "Vazirmatn, Tahoma, system-ui, sans-serif",
        background: "linear-gradient(160deg, #F0F5F9 0%, #E8EEF6 50%, #ECF2FF 100%)",
      }}
      dir="rtl"
    >
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-[#5D87FF] text-white text-xl font-bold flex items-center justify-center shadow-lg shadow-[#5D87FF]/35">
            W
          </div>
          <p className="text-2xl font-bold tracking-tight text-[#2A3547]">WebSpeed</p>
          <p className="text-sm text-[#7C8FAC] mt-2">ورود به پنل مدیریت فروشگاه</p>
        </div>

        <div className="bg-white border border-[#E5EAEF] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#2A3547]">ایمیل</label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7C8FAC]" />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@webspeed.ir"
                  className="w-full h-12 pr-11 pl-3.5 rounded-xl border border-[#E5EAEF] bg-[#F8FAFC] text-sm text-[#2A3547] placeholder:text-[#7C8FAC]/60 outline-none focus:border-[#5D87FF] focus:ring-2 focus:ring-[#5D87FF]/20 transition-shadow"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#2A3547]">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7C8FAC]" />
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pr-11 pl-11 rounded-xl border border-[#E5EAEF] bg-[#F8FAFC] text-sm text-[#2A3547] placeholder:text-[#7C8FAC]/60 outline-none focus:border-[#5D87FF] focus:ring-2 focus:ring-[#5D87FF]/20 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 inline-flex items-center justify-center rounded-lg text-[#7C8FAC] hover:bg-[#F0F5F9]"
                  aria-label={showPass ? "مخفی کردن رمز" : "نمایش رمز"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-[#FA896B] bg-[#FDEDE8] rounded-xl px-3.5 py-2.5 font-medium">{error}</p>
            )}

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-[#7C8FAC] cursor-pointer select-none">
                <input type="checkbox" className="rounded border-[#E5EAEF] text-[#5D87FF] focus:ring-[#5D87FF]" />
                مرا به خاطر بسپار
              </label>
              <button type="button" className="text-[#5D87FF] font-semibold hover:underline">
                فراموشی رمز؟
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#5D87FF] text-white text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-[#4570EA] disabled:opacity-60 shadow-lg shadow-[#5D87FF]/30 transition-colors"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "در حال ورود..." : "ورود به پنل"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#7C8FAC] mt-8">
          <Link href="/" className="hover:text-[#5D87FF] font-medium transition-colors">
            بازگشت به فروشگاه
          </Link>
        </p>
      </div>
    </div>
  );
}
