"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, errorMessage } from "@/lib/api/client";

type Customer = { phone: string; name: string; email: string };

/** Customer profile: view/edit name and email, logout */
export default function ProfileForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const opts = { refresh: false, redirectOnExpire: false } as const;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await api("/customer/me", { method: "PATCH", body: { name, email }, ...opts });
      setMsg({ ok: true, text: "اطلاعات ذخیره شد" });
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err, "ذخیره ناموفق بود") });
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await api("/customer/logout", { method: "POST", ...opts }).catch(() => null);
    router.replace("/login");
    router.refresh();
  };

  const input = "w-full h-11 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-foreground/40";

  return (
    <form onSubmit={save} className="space-y-3 text-sm">
      <div>
        <p className="text-muted-foreground">تلفن</p>
        <p className="font-medium num" dir="ltr">
          {customer.phone}
        </p>
      </div>
      <label className="block space-y-1">
        <span className="text-muted-foreground">نام</span>
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="block space-y-1">
        <span className="text-muted-foreground">ایمیل (اختیاری)</span>
        <input className={input} type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      {msg && (
        <p role="status" className={msg.ok ? "text-emerald-700" : "text-red-700"}>
          {msg.text}
        </p>
      )}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={busy} className="h-10 px-4 bg-foreground text-background text-sm font-medium disabled:opacity-50">
          {busy ? "..." : "ذخیره"}
        </button>
        <button type="button" onClick={logout} className="h-10 px-4 border border-border text-sm">
          خروج
        </button>
      </div>
    </form>
  );
}
