"use client";

import { useState } from "react";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import { ApiError, api, errorMessage } from "@/lib/api/client";

/** Change own password; the API revokes every other session */
export default function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; details?: string[] } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== repeat) {
      setMsg({ ok: false, text: "تکرار رمز جدید با آن یکسان نیست" });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await api("/auth/password", { method: "POST", body: { currentPassword: current, newPassword: next } });
      setCurrent("");
      setNext("");
      setRepeat("");
      setMsg({ ok: true, text: "رمز عبور تغییر کرد. نشست‌های دیگر شما بسته شدند." });
    } catch (err) {
      const details =
        err instanceof ApiError && err.details && typeof err.details === "object"
          ? ((err.details as { newPassword?: string[] }).newPassword ?? undefined)
          : undefined;
      setMsg({ ok: false, text: errorMessage(err, "تغییر رمز ناموفق بود"), details });
    } finally {
      setBusy(false);
    }
  };

  const label = "block text-xs font-semibold text-[#525252] mb-1.5";

  return (
    <form onSubmit={submit} className="bg-white border border-[#E8E8E8] rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-bold">تغییر رمز عبور</h2>
      <label className="block">
        <span className={label}>رمز فعلی</span>
        <AdminInput type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
      </label>
      <label className="block">
        <span className={label}>رمز جدید (حداقل ۸ کاراکتر)</span>
        <AdminInput type="password" autoComplete="new-password" required value={next} onChange={(e) => setNext(e.target.value)} />
      </label>
      <label className="block">
        <span className={label}>تکرار رمز جدید</span>
        <AdminInput type="password" autoComplete="new-password" required value={repeat} onChange={(e) => setRepeat(e.target.value)} />
      </label>
      {msg && (
        <div role="status" className={`text-sm rounded-xl px-4 py-3 ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          <p>{msg.text}</p>
          {msg.details?.map((d) => (
            <p key={d} className="text-xs mt-1">
              • {d}
            </p>
          ))}
        </div>
      )}
      <AdminButton type="submit" variant="primary" loading={busy}>
        تغییر رمز
      </AdminButton>
    </form>
  );
}
