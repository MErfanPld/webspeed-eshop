import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";
import { storeInfo } from "@/data/store";
import Newsletter from "@/components/home/Newsletter";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              WEBSPEED
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {storeInfo.description}
            </p>
            <div className="flex gap-3">
              <a
                href={storeInfo.social.instagram}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="اینستاگرام"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={storeInfo.social.twitter}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="توییتر"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              فروشگاه
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground">
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link
                  href="/products?gender=men"
                  className="hover:text-foreground"
                >
                  مردانه
                </Link>
              </li>
              <li>
                <Link
                  href="/products?gender=women"
                  className="hover:text-foreground"
                >
                  زنانه
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=newest"
                  className="hover:text-foreground"
                >
                  جدیدترین‌ها
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              پشتیبانی
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-foreground">
                  پیگیری سفارش
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">تماس</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>{storeInfo.address}</li>
              <li dir="ltr" className="text-right">
                {storeInfo.phone}
              </li>
              <li>{storeInfo.email}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Newsletter compact />
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} WebSpeed. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
