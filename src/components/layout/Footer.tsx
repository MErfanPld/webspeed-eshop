import Link from "next/link";
import { storeInfo } from "@/data/store";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <hr className="rule" />
      <div className="mx-auto max-w-content px-4 xs:px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Link
              href="/"
              className="text-sm font-medium tracking-[0.18em] uppercase"
            >
              WebSpeed
            </Link>
            <p className="type-body text-muted-foreground max-w-xs leading-relaxed">
              {storeInfo.description}
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="type-label text-muted-foreground mb-4">فروشگاه</p>
            <ul className="space-y-3 type-caption">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link href="/products?gender=men" className="hover:text-foreground transition-colors">
                  مردانه
                </Link>
              </li>
              <li>
                <Link href="/products?gender=women" className="hover:text-foreground transition-colors">
                  زنانه
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="type-label text-muted-foreground mb-4">کمک</p>
            <ul className="space-y-3 type-caption">
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  تماس
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  درباره
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-foreground transition-colors">
                  سفارش‌ها
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="type-label text-muted-foreground mb-4">تماس</p>
            <ul className="space-y-3 type-caption">
              <li>{storeInfo.address}</li>
              <li className="num" dir="ltr">
                {storeInfo.phone}
              </li>
              <li>{storeInfo.email}</li>
            </ul>
          </div>
        </div>

        <hr className="rule my-10" />

        <p className="type-caption text-center">
          © {new Date().getFullYear()} WebSpeed
        </p>
      </div>
    </footer>
  );
}
