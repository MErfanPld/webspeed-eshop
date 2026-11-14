"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ImagePlus, Upload, X } from "lucide-react";
import { listMedia, uploadMedia, type MediaItem } from "@/lib/media-client";
import { errorMessage } from "@/lib/api/client";

/** Small button that opens the media library and returns the chosen URL */
export default function MediaPickerButton({ onPick }: { onPick: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setItems(null);
    setError(null);
    listMedia()
      .then((list) => !cancelled && setItems(list))
      .catch((e) => {
        if (cancelled) return;
        setError(errorMessage(e, "دریافت کتابخانه رسانه ناموفق بود"));
        setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const item = await uploadMedia(file);
      onPick(item.url);
      setOpen(false);
    } catch (e) {
      setError(errorMessage(e, "آپلود ناموفق بود"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 w-9 shrink-0 rounded-lg border border-border inline-flex items-center justify-center hover:bg-muted"
        title="کتابخانه رسانه"
        aria-label="انتخاب از کتابخانه رسانه"
      >
        <ImagePlus className="h-4 w-4" />
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="کتابخانه رسانه"
              className="relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
                <p className="text-sm font-bold">کتابخانه رسانه</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="h-9 px-3 rounded-lg bg-[#111] text-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? "در حال آپلود..." : "آپلود"}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => onFile(e.target.files?.[0])}
                  />
                  <button type="button" onClick={() => setOpen(false)} className="h-9 w-9 rounded-lg hover:bg-muted inline-flex items-center justify-center" aria-label="بستن">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {error && <p className="mx-4 mt-3 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {!items && <p className="col-span-full text-center text-xs text-muted-foreground py-8">در حال بارگذاری...</p>}
                {items?.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onPick(m.url);
                      setOpen(false);
                    }}
                    className="group rounded-xl border border-border overflow-hidden text-right hover:ring-2 hover:ring-[#111]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt={m.name} className="h-20 w-full object-cover bg-muted" />
                    <span className="block px-2 py-1 text-[10px] truncate text-muted-foreground">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
