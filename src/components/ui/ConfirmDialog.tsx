"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/**
 * Promise-based confirmation dialog.
 *
 *   if (await confirmDialog({ title: "حذف؟", danger: true })) …
 *
 * Mount <ConfirmHost /> once (builder shell, admin shell).
 */
export type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type Pending = ConfirmOptions & { resolve: (ok: boolean) => void };

let pending: Pending | null = null;
let hostMounted = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function confirmDialog(opts: ConfirmOptions): Promise<boolean> {
  // Without a host (e.g. tests), fall back to the native dialog
  if (!hostMounted) {
    if (typeof window === "undefined") return Promise.resolve(false);
    return Promise.resolve(window.confirm(opts.message ? `${opts.title}\n${opts.message}` : opts.title));
  }
  pending?.resolve(false);
  return new Promise((resolve) => {
    pending = { ...opts, resolve };
    emit();
  });
}

function close(ok: boolean) {
  const p = pending;
  pending = null;
  emit();
  p?.resolve(ok);
}

export function ConfirmHost() {
  const current = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => pending,
    () => null
  );
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    hostMounted++;
    return () => {
      hostMounted--;
    };
  }, []);

  useEffect(() => {
    if (!current) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [current]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/40" onClick={() => close(false)} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ws-confirm-title"
        className="relative w-full max-w-sm rounded-2xl bg-white border border-[#E8E8E8] shadow-xl p-5 space-y-4"
        style={{ fontFamily: "Vazirmatn, Tahoma, system-ui, sans-serif" }}
      >
        <div className="space-y-1.5">
          <p id="ws-confirm-title" className="text-sm font-bold text-[#111]">
            {current.title}
          </p>
          {current.message && (
            <p className="text-xs text-[#737373] leading-relaxed">{current.message}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => close(false)}
            className="h-9 px-4 rounded-xl border border-[#E8E8E8] text-xs font-semibold hover:bg-[#F7F7F7]"
          >
            {current.cancelLabel || "انصراف"}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => close(true)}
            className={cn(
              "h-9 px-4 rounded-xl text-xs font-semibold text-white",
              current.danger ? "bg-red-600 hover:bg-red-700" : "bg-[#111] hover:bg-black"
            )}
          >
            {current.confirmLabel || "تأیید"}
          </button>
        </div>
      </div>
    </div>
  );
}
