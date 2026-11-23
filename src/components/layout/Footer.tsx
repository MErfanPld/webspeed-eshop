"use client";

import Link from "next/link";
import { useStoreInfo } from "@/context/StoreInfoContext";
import { ArrowUp, Clock, CreditCard, Headphones, Instagram, Mail, MapPin, Phone, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const SHOP_LINKS = [
  ["/products", "همه محصولات"],
  ["/products?sort=newest", "جدیدترین‌ها"],
  ["/products?sort=bestseller", "پرفروش‌ها"],
  ["/products?sort=discount", "تخفیف‌دارها"],
] as const;

const HELP_LINKS = [
  ["/track", "پیگیری سفارش"],
  ["/profile", "حساب کاربری"],
  ["/cart", "سبد خرید"],
  ["/contact", "تماس با ما"],
  ["/about", "درباره ما"],
] as const;

/** Instagram may be stored as a handle, @handle or a full URL */
function instagramUrl(v: string): string | null {
  const s = v.trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  return `https://instagram.com/${s.replace(/^@/, "")}`;
}

/** Default storefront footer (used until the store publishes its own footer in the builder) */
export default function Footer() {
  const store = useStoreInfo();
  const insta = instagramUrl(store.instagram);
  const freeOver = Number(store.shipping?.freeOver || 0);
  const perks = [
    { icon: Truck, title: "ارسال سریع", text: freeOver > 0 ? `رایگان برای خرید بالای ${formatPrice(freeOver)}` : "به سراسر کشور" },
    { icon: ShieldCheck, title: "ضمانت اصالت", text: "کالای اصل با فاکتور" },
    { icon: RotateCcw, title: "بازگشت آسان", text: "۷ روز ضمانت بازگشت" },
    { icon: CreditCard, title: "پرداخت امن", text: "درگاه بانکی یا کارت‌به‌کارت" },
  ];

  return (
    <footer className="relative isolate overflow-hidden mt-auto bg-[#17142a] text-white">
      <span className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-primary/30 blur-[110px] -z-10" aria-hidden />
      <span className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-accent/20 blur-[110px] -z-10" aria-hidden />

      {/* Perks */}
      <div className="border-b border-white/10">
        <ul className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-7 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((p) => (
            <li key={p.title} className="flex items-center gap-3">
              <span className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center shrink-0 shadow-lg shadow-primary/30">
                <p.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">{p.title}</span>
                <span className="block text-[11px] text-white/55 truncate">{p.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center text-base font-black shadow-lg shadow-primary/30">
              {(store.name || "ف").slice(0, 1)}
            </span>
            <span className="text-lg font-extrabold">{store.name || "فروشگاه"}</span>
          </Link>
          {store.tagline && <p className="text-sm text-white/60 leading-7 max-w-sm">{store.tagline}</p>}
          <div className="flex items-center gap-2">
            {insta && (
              <a href={insta} target="_blank" rel="noopener" aria-label="اینستاگرام" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-primary hover:to-accent grid place-items-center transition">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {store.email && (
              <a href={`mailto:${store.email}`} aria-label="ایمیل" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-primary hover:to-accent grid place-items-center transition">
                <Mail className="h-4 w-4" />
              </a>
            )}
            {store.phone && (
              <a href={`tel:${store.phone.replace(/[^\d+]/g, "")}`} aria-label="تماس" className="h-10 w-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-primary hover:to-accent grid place-items-center transition">
                <Phone className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <nav className="lg:col-span-2" aria-label="فروشگاه">
          <p className="text-sm font-bold mb-4">فروشگاه</p>
          <ul className="space-y-2.5 text-sm text-white/65">
            {SHOP_LINKS.map(([href, label]) => (
              <li key={href}><Link href={href} className="hover:text-white hover:pr-1 transition-all">{label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav className="lg:col-span-2" aria-label="راهنمای خرید">
          <p className="text-sm font-bold mb-4">راهنمای خرید</p>
          <ul className="space-y-2.5 text-sm text-white/65">
            {HELP_LINKS.map(([href, label]) => (
              <li key={href}><Link href={href} className="hover:text-white hover:pr-1 transition-all">{label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4 space-y-3">
          <p className="text-sm font-bold mb-4">ارتباط با ما</p>
          {store.address && (
            <p className="flex gap-3 text-sm text-white/70 leading-7"><MapPin className="h-4 w-4 mt-1.5 shrink-0 text-accent" />{store.address}</p>
          )}
          {store.phone && (
            <p className="flex gap-3 text-sm text-white/70"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent" /><span dir="ltr" className="num">{store.phone}</span></p>
          )}
          {store.workingHours && (
            <p className="flex gap-3 text-sm text-white/70"><Clock className="h-4 w-4 mt-0.5 shrink-0 text-accent" />{store.workingHours}</p>
          )}
          {!store.address && !store.phone && !store.workingHours && (
            <p className="flex gap-3 text-sm text-white/60"><Headphones className="h-4 w-4 mt-0.5 shrink-0" />از صفحه «تماس با ما» با ما در ارتباط باشید.</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/45">
            © {new Intl.NumberFormat("fa-IR", { useGrouping: false }).format(new Date().getFullYear())} {store.name}. تمامی حقوق محفوظ است.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
          >
            بازگشت به بالا <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
