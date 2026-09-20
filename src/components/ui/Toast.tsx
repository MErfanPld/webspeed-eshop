"use client";

import { useEffect } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastProps = {
  message: string;
  type?: "error" | "success" | "info";
  open: boolean;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type = "error",
  open,
  onClose,
  duration = 3500,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[min(22rem,calc(100vw-2rem))]"
      role="alert"
    >
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl px-4 py-3.5 shadow-lg border text-sm",
          type === "error" && "bg-white border-red-200 text-foreground",
          type === "success" && "bg-white border-emerald-200 text-foreground",
          type === "info" && "bg-white border-border text-foreground"
        )}
      >
        {type === "error" && (
          <AlertCircle className="h-5 w-5 text-[var(--discount)] shrink-0 mt-0.5" />
        )}
        {type === "success" && (
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        )}
        <p className="flex-1 leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center"
          aria-label="بستن"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
