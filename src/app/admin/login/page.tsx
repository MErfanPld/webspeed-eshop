"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";

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
      setError("\u0627\u06cc\u0645\u06cc\u0644 \u0648 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0631\u0627 \u0648\u0627\u0631\u062f \u06a9\u0646\u06cc\u062f.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    router.push("/admin");
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-4 bg-[#F7F7F7]"
      style={{ fontFamily: "Vazirmatn, Tahoma, system-ui, sans-serif" }}
      dir="rtl"
    >
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="mx-auto h-11 w-11 rounded-xl bg-[#111] text-white text-sm font-bold flex items-center justify-center mb-4">
            W
          </div>
          <h1 className="text-xl font-semibold text-[#111] tracking-tight">\u0648\u0631\u0648\u062f \u0628\u0647 \u067e\u0646\u0644</h1>
          <p className="text-sm text-[#737373] mt-1.5">WebSpeed Admin</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white border border-[#E8E8E8] rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm"
        >
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-[#525252]">\u0627\u06cc\u0645\u06cc\u0644</span>
            <AdminInput
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@webspeed.ir"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-[#525252]">\u0631\u0645\u0632 \u0639\u0628\u0648\u0631</span>
            <AdminInput
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            />
          </label>

          {error && (
            <p className="text-xs text-[#E31B23] bg-[#FEF2F2] rounded-lg px-3 py-2">{error}</p>
          )}

          <AdminButton type="submit" variant="primary" className="w-full" loading={loading}>
            \u0648\u0631\u0648\u062f
          </AdminButton>
        </form>

        <p className="text-center text-xs text-[#A3A3A3] mt-6">
          <Link href="/" className="hover:text-[#111] underline-offset-2 hover:underline">
            \u0628\u0627\u0632\u06af\u0634\u062a \u0628\u0647 \u0641\u0631\u0648\u0634\u06af\u0627\u0647
          </Link>
        </p>
      </div>
    </div>
  );
}
