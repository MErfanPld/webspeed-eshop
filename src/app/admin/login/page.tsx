"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-[100dvh] bg-[var(--admin-bg)] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <p className="text-xl font-semibold tracking-tight text-[var(--admin-text)]">WebSpeed</p>
          <p className="text-sm text-[var(--admin-text-secondary)] mt-2 leading-relaxed">
            مدیریت فروشگاه شما
          </p>
        </div>

        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[var(--admin-radius-lg)] shadow-[var(--admin-shadow-md)] p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <AdminInput
              label="ایمیل یا نام کاربری"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@webspeed.ir"
            />
            <AdminInput
              label="رمز عبور"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-[var(--admin-radius-sm)] px-3 py-2">{error}</p>
            )}
            <AdminButton type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              {loading ? "در حال ورود..." : "ورود به پنل"}
            </AdminButton>
          </form>
          <div className="mt-5 text-center">
            <button type="button" className="text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)]">
              فراموشی رمز عبور
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--admin-text-secondary)] mt-8">
          <Link href="/" className="hover:text-[var(--admin-text)]">بازگشت به فروشگاه</Link>
        </p>
      </div>
    </div>
  );
}
