"use client";

import { useState } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { Address, OrderCustomer } from "@/types/api";
import { api, ApiError, errorMessage } from "@/lib/api/client";
import { confirmDialog } from "@/components/ui/ConfirmDialog";

type Draft = Omit<Address, "id" | "isDefault"> & { id?: number; isDefault: boolean };

const empty: Draft = { title: "", fullName: "", phone: "", province: "", city: "", address: "", postalCode: "", isDefault: false };

const FIELDS: { key: keyof Draft; label: string; ltr?: boolean; wide?: boolean }[] = [
  { key: "title", label: "عنوان (مثلاً خانه)" },
  { key: "fullName", label: "نام گیرنده" },
  { key: "phone", label: "موبایل", ltr: true },
  { key: "province", label: "استان" },
  { key: "city", label: "شهر" },
  { key: "postalCode", label: "کد پستی", ltr: true },
  { key: "address", label: "آدرس کامل", wide: true },
];

export default function AddressBook({
  initial,
  suggestion,
}: {
  initial: Address[];
  suggestion?: OrderCustomer & { title: string };
}) {
  const [list, setList] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = async () => setList((await api<{ addresses: Address[] }>("/customer/addresses")).addresses);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError(null);
    setErrors({});
    try {
      const { id, ...body } = draft;
      if (id) await api(`/customer/addresses/${id}`, { method: "PUT", body });
      else await api("/customer/addresses", { method: "POST", body });
      setDraft(null);
      await reload();
    } catch (err) {
      if (err instanceof ApiError && err.details && typeof err.details === "object") setErrors(err.details as Record<string, string>);
      setError(errorMessage(err, "ذخیره آدرس ناموفق بود"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (a: Address) => {
    if (!(await confirmDialog({ title: `حذف آدرس «${a.title || a.city}»؟`, confirmLabel: "حذف", danger: true }))) return;
    try {
      await api(`/customer/addresses/${a.id}`, { method: "DELETE" });
      await reload();
    } catch (err) {
      setError(errorMessage(err, "حذف ناموفق بود"));
    }
  };

  const makeDefault = async (a: Address) => {
    try {
      const { id, ...rest } = a;
      await api(`/customer/addresses/${id}`, { method: "PUT", body: { ...rest, isDefault: true } });
      await reload();
    } catch (err) {
      setError(errorMessage(err, "تغییر ناموفق بود"));
    }
  };

  if (draft) {
    return (
      <form onSubmit={save} className="space-y-3" aria-label="فرم آدرس">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FIELDS.map((f) => (
            <label key={f.key} className={f.wide ? "sm:col-span-2 block" : "block"}>
              <span className="block text-xs text-muted-foreground mb-1">{f.label}</span>
              <input
                name={f.key}
                value={String(draft[f.key] ?? "")}
                dir={f.ltr ? "ltr" : undefined}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                aria-invalid={!!errors[f.key]}
                className="w-full h-10 border border-border bg-transparent px-3 text-sm"
              />
              {errors[f.key] && <span className="block text-[11px] text-red-700 mt-1">{errors[f.key]}</span>}
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={draft.isDefault} onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })} />
          آدرس پیش‌فرض
        </label>
        {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="h-10 px-4 bg-foreground text-background text-sm font-medium disabled:opacity-60">
            {busy ? "در حال ذخیره..." : "ذخیره آدرس"}
          </button>
          <button type="button" onClick={() => setDraft(null)} className="h-10 px-4 border border-border text-sm">
            انصراف
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
      {!list.length && <p className="text-sm text-muted-foreground">هنوز آدرسی ذخیره نکرده‌اید؛ در تسویه حساب از آن استفاده می‌شود.</p>}
      <ul className="space-y-2">
        {list.map((a) => (
          <li key={a.id} className="border border-border p-3 text-sm flex gap-2" data-testid="address-item">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">
                {a.title || a.city} {a.isDefault && <span className="text-[11px] text-emerald-700">(پیش‌فرض)</span>}
              </p>
              <p className="text-muted-foreground text-xs leading-6">
                {a.fullName} · {a.province}، {a.city}، {a.address}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              {!a.isDefault && (
                <button type="button" aria-label="پیش‌فرض" onClick={() => makeDefault(a)} className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted">
                  <Star className="h-4 w-4" />
                </button>
              )}
              <button type="button" aria-label="ویرایش آدرس" onClick={() => setDraft({ ...a })} className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" aria-label="حذف آدرس" onClick={() => remove(a)} className="h-8 w-8 inline-flex items-center justify-center hover:bg-red-50 text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() =>
          setDraft(
            !list.length && suggestion
              ? { ...empty, ...suggestion, isDefault: true }
              : { ...empty, isDefault: !list.length }
          )
        }
        className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4"
      >
        <Plus className="h-4 w-4" /> افزودن آدرس
      </button>
    </div>
  );
}
