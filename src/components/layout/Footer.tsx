import Link from "next/link";
import { storeInfo } from "@/data/store";
import { Instagram, Mail, MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="border-b border-background/10">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center sm:text-right">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
              <div className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-background/50 mb-0.5">آدرس</p>
                <p className="text-sm text-background/90">{storeInfo.address}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
              <div className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-background/50 mb-0.5">تماس</p>
                <p className="text-sm text-background/90 num" dir="ltr">
                  {storeInfo.phone}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
              <div className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-background/50 mb-0.5">ساعات کاری</p>
                <p className="text-sm text-background/90">{storeInfo.workingHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link
              href="/"
              className="text-sm font-bold tracking-[0.18em] uppercase inline-block"
            >
              WebSpeed
            </Link>
            <p className="text-[13px] text-background/55 leading-relaxed max-w-xs">
              {storeInfo.description}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={storeInfo.social?.instagram || "#"}
                className="h-9 w-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                aria-label="اینستاگرام"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a
                href={`mailto:${storeInfo.email}`}
                className="h-9 w-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                aria-label="ایمیل"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-background/40 mb-4">
              فروشگاه
            </p>
            <ul className="space-y-2.5 text-[13px] text-background/70">
              <li>
                <Link href="/products" className="hover:text-background transition-colors">
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link href="/products?gender=men" className="hover:text-background transition-colors">
                  مردانه
                </Link>
              </li>
              <li>
                <Link href="/products?gender=women" className="hover:text-background transition-colors">
                  زنانه
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="hover:text-background transition-colors">
                  جدیدترین‌ها
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-background/40 mb-4">
              پشتیبانی
            </p>
            <ul className="space-y-2.5 text-[13px] text-background/70">
              <li>
                <Link href="/contact" className="hover:text-background transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-background transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-background transition-colors">
                  پیگیری سفارش
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-background transition-colors">
                  سبد خرید
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-background/40 mb-4">
              خبرنامه
            </p>
            <p className="text-[13px] text-background/55 mb-3 leading-relaxed">
              از تخفیف‌ها و محصولات جدید باخبر شوید.
            </p>
            <form className="flex flex-col gap-2" action="#" method="post">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="h-10 px-3 rounded-lg bg-background/10 border border-background/15 text-sm text-background placeholder:text-background/35 focus:outline-none focus:border-background/40"
                dir="ltr"
              />
              <button
                type="submit"
                className="h-10 rounded-lg bg-background text-foreground text-sm font-semibold hover:bg-background/90 transition-colors"
              >
                عضویت
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-background/40">
            © {new Date().getFullYear()} WebSpeed. تمامی حقوق محفوظ است.
          </p>
          <p className="text-[11px] text-background/35">
            پرداخت امن · ارسال سریع · پشتیبانی
          </p>
        </div>
      </div>
    </footer>
  );
}
