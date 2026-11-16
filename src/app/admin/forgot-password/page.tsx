"use client";

import { useState } from "react";
import AuthCard from "@/components/admin/auth/AuthCard";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";
import { api, errorMessage } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api("/auth/password/forgot", { method: "POST", body: { email: email.trim() }, refresh: false });
      setSent(true);
    } catch (err) {
      setError(errorMessage(err, "ارسال ناموفق بود"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="بازیابی رمز عبور" subtitle="ایمیل حساب را وارد کنید تا لینک تعیین رمز جدید برایتان ارسال شود.">
      {sent ? (
        <p role="status" className="text-sm text-[#047857] bg-[#ECFDF5] rounded-lg px-3 py-3 leading-6">
          اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی (با اعتبار ۱ ساعت) ارسال شد. صندوق ایمیل را بررسی کنید.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-[#525252]">ایمیل</span>
            <AdminInput type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" />
          </label>
          {error && <p role="alert" className="text-xs text-[#E31B23] bg-[#FEF2F2] rounded-lg px-3 py-2">{error}</p>}
          <AdminButton type="submit" variant="primary" className="w-full" loading={loading}>
            ارسال لینک بازیابی
          </AdminButton>
        </form>
      )}
    </AuthCard>
  );
}
