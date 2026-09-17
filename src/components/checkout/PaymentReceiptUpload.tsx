"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";

type Props = {
  onFileChange: (file: File | null) => void;
};

export default function PaymentReceiptUpload({ onFileChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("لطفاً یک فایل تصویری انتخاب کنید");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    onFileChange(file);
  };

  const clear = () => {
    setPreview(null);
    setFileName(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">آپلود رسید پرداخت</p>
      {preview ? (
        <div className="relative inline-block">
          <div className="relative h-40 w-32 overflow-hidden border border-border rounded-sm">
            <Image
              src={preview}
              alt="رسید"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <button
            type="button"
            onClick={clear}
            className="absolute -top-2 -left-2 p-1 rounded-full bg-foreground text-background"
            aria-label="حذف تصویر"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="text-xs text-muted-foreground mt-2 truncate max-w-[128px]">
            {fileName}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-sm hover:border-foreground transition-colors"
        >
          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">
            انتخاب تصویر رسید
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            JPG, PNG تا ۵ مگابایت
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
