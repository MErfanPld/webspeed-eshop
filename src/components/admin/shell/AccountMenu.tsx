"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, KeyRound, LogOut, Plus, Store } from "lucide-react";
import { useAdminSession } from "@/context/AdminSessionContext";
import { api } from "@/lib/api/client";

const ROLE_FA = { owner: "مالک", admin: "مدیر", editor: "ویرایشگر" } as const;

/** Avatar menu: current user, store switcher and logout */
export default function AccountMenu() {
  const session = useAdminSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!session) return null;
  const initial = (session.user.name || session.user.email).trim().charAt(0).toUpperCase();

  const switchStore = async (storeId: string) => {
    setBusy(true);
    try {
      await api("/admin/store", { method: "POST", body: { storeId } });
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    await api("/auth/logout", { method: "POST" }).catch(() => null);
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-8 w-8 rounded-full bg-gradient-to-l from-[#7c3aed] to-[#db2777] text-white shadow-md shadow-[#7c3aed]/20 text-xs font-bold flex items-center justify-center shrink-0"
        aria-haspopup="menu"
        aria-expanded={open}
        title={session.user.email}
      >
        {initial}
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-10 z-50 w-64 max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-2xl border border-[#E8E8E8] bg-white shadow-xl p-2 text-sm">
          <div className="px-3 py-2 border-b border-[#F0F0F0] mb-1">
            <p className="font-semibold text-[#111] truncate">{session.user.name}</p>
            <p className="text-xs text-[#737373] truncate" dir="ltr">
              {session.user.email}
            </p>
          </div>
          <p className="px-3 pt-1 pb-1 text-[10px] font-bold text-[#A3A3A3]">فروشگاه‌ها</p>
          {/* Long store lists scroll so the actions below stay on screen */}
          <div className="max-h-[min(40vh,18rem)] overflow-y-auto overscroll-contain">
          {session.memberships.map((m) => (
            <button
              key={m.storeId}
              type="button"
              disabled={busy}
              onClick={() => m.storeId !== session.store.storeId && switchStore(m.storeId)}
              className="w-full flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[#F7F7F7] text-right"
              role="menuitem"
            >
              <Store className="h-4 w-4 text-[#737373]" />
              <span className="flex-1 min-w-0">
                <span className="block truncate text-[#111]">{m.storeName}</span>
                <span className="block text-[10px] text-[#A3A3A3]">{ROLE_FA[m.role]}</span>
              </span>
              {m.storeId === session.store.storeId && <Check className="h-4 w-4 text-emerald-600" />}
            </button>
          ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/admin/stores");
            }}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[#F7F7F7] text-right text-[#525252]"
            role="menuitem"
          >
            <Plus className="h-4 w-4" />
            مدیریت فروشگاه‌ها
          </button>
          <div className="border-t border-[#F0F0F0] mt-1 pt-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/admin/account");
              }}
              className="w-full flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[#F7F7F7] text-right text-[#525252]"
              role="menuitem"
            >
              <KeyRound className="h-4 w-4" />
              تغییر رمز عبور
            </button>
            <button
              type="button"
              onClick={logout}
              disabled={busy}
              className="w-full flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-red-50 text-red-600 text-right"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
