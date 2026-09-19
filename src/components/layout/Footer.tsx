import Link from "next/link";
import { storeInfo } from "@/data/store";

export default function Footer() {
  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="mx-auto max-w-content px-4 xs:px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="text-sm font-bold tracking-[0.2em] uppercase">
              WebSpeed
            </Link>
            <p className="text-sm text-background/60 leading-relaxed max-w-xs">
              {storeInfo.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-background/50 mb-4">
              فروشگاه
            </p>
            <ul className="space-y-2.5 text-sm text-background/75">
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
            <p className="text-xs font-semibold tracking-wider uppercase text-background/50 mb-4">
              پشتیبانی
            </p>
            <ul className="space-y-2.5 text-sm text-background/75">
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
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-background/50 mb-4">
              تماس
            </p>
            <ul className="space-y-2.5 text-sm text-background/75">
              <li>{storeInfo.address}</li>
              <li className="num" dir="ltr">
                {storeInfo.phone}
              </li>
              <li>{storeInfo.email}</li>
              <li>{storeInfo.workingHours}</li>
            </ul>
          </div>
        </div>

        <hr className="border-0 h-px bg-background/15 my-10" />

        <p className="text-center text-xs text-background/45">
          © {new Date().getFullYear()} WebSpeed. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
