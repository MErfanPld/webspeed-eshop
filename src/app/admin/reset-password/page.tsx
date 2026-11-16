"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/admin/auth/AuthCard";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";
import { api, ApiError, errorMessage } from "@/lib/api/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("تکرار رمز عبور یکسان نیست.");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    setLoading(true);
    setError(null);
    try {
      await api("/auth/password/reset", {
        method: "POST",
        body: { uid: params.get("uid") ?? "", token: params.get("token") ?? "", password },
        refresh: false,
      });
      setDone(true);
    } catch (err) {
      const details = err instanceof ApiError && err.details && typeof err.details === "object" ? (err.details as { password?: string[] }) : null;
      setError(details?.password?.join(" ") || errorMessage(err, "تغییر رمز ناموفق بود"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="تعیین رمز عبور جدید">
      {done ? (
        <div className="space-y-4 text-center">
          <p role="status" className="text-sm text-[#047857] bg-[#ECFDF5] rounded-lg px-3 py-3">رمز عبور تغییر کرد.</p>
          <Link href="/admin/login" className="inline-block text-sm font-semibold underline">
            ورود با رمز جدید
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-[#525252]">رمز جدید (حداقل ۸ کاراکتر)</span>
            <AdminInput type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-[#525252]">تکرار رمز جدید</span>
            <AdminInput type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
          {error && <p role="alert" className="text-xs text-[#E31B23] bg-[#FEF2F2] rounded-lg px-3 py-2">{error}</p>}
          <AdminButton type="submit" variant="primary" className="w-full" loading={loading}>
            ذخیره رمز جدید
          </AdminButton>
        </form>
      )}
    </AuthCard>
  );
}
