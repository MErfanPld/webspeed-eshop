import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/products/ProductGrid";
import Container from "@/components/ui/Container";
import { getFeaturedProducts, getNewArrivals } from "@/data/products";
import { categories } from "@/data/categories";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 8);
  const newest = getNewArrivals().slice(0, 4);
  const cats = categories.filter((c) => c.id !== "all").slice(0, 6);

  return (
    <div className="no-x-scroll">
      <section className="relative h-[min(88vh,860px)] min-h-[480px] w-full overflow-hidden bg-foreground">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover object-[center_30%] opacity-75"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-20 lg:pb-24 px-5 text-center">
          <p className="type-label text-white/80 mb-4">فصل جدید</p>
          <h1 className="type-display text-white max-w-[16ch]">
            آماده برای شروع دوباره
          </h1>
          <p className="mt-4 type-body text-white/80 max-w-md">
            لایه‌های سبک برای روزهای خنک. کیفیت بدون مصالحه.
          </p>
          <div className="mt-8 flex flex-col xs:flex-row gap-3 w-full xs:w-auto">
            <Link href="/products?gender=men" className="btn-primary bg-white text-foreground hover:opacity-90 w-full xs:w-auto">
              مردانه
            </Link>
            <Link href="/products?gender=women" className="btn-outline border-white text-white shadow-[inset_0_0_0_1px_#fff] hover:bg-white hover:text-foreground w-full xs:w-auto">
              زنانه
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2">
        <Link
          href="/products?gender=men"
          className="group relative aspect-[4/5] md:aspect-auto md:min-h-[520px] overflow-hidden bg-muted"
        >
          <Image
            src="https://images.unsplash.com/photo-1490576476680-64ee07a35a7f?w=1200&q=80"
            alt="مردانه"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-foreground/25 group-hover:bg-foreground/35 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 sm:pb-14">
            <span className="type-headline text-white mb-4">آقایان</span>
            <span className="btn-outline text-white shadow-[inset_0_0_0_1px_#fff] hover:bg-white hover:text-foreground text-xs">
              خرید مردانه
            </span>
          </div>
        </Link>
        <Link
          href="/products?gender=women"
          className="group relative aspect-[4/5] md:aspect-auto md:min-h-[520px] overflow-hidden bg-muted"
        >
          <Image
            src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80"
            alt="زنانه"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-foreground/25 group-hover:bg-foreground/35 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 sm:pb-14">
            <span className="type-headline text-white mb-4">بانوان</span>
            <span className="btn-outline text-white shadow-[inset_0_0_0_1px_#fff] hover:bg-white hover:text-foreground text-xs">
              خرید زنانه
            </span>
          </div>
        </Link>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <p className="type-label text-muted-foreground mb-1.5">تازه رسیده</p>
              <h2 className="type-headline">جدیدترین‌ها</h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="type-caption font-medium text-foreground underline underline-offset-4 hover:opacity-70"
            >
              مشاهده همه
            </Link>
          </div>
          <ProductGrid products={newest} />
        </Container>
      </section>

      <section className="pb-14 sm:pb-20">
        <Container>
          <div className="mb-8 sm:mb-10">
            <p className="type-label text-muted-foreground mb-1.5">کاوش</p>
            <h2 className="type-headline">خرید بر اساس دسته</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
            {cats.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-muted"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
                <span className="absolute bottom-4 right-4 left-4 type-title text-white text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative py-24 sm:py-32 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1800&q=80"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-foreground/55" />
        <Container className="relative text-center">
          <p className="type-label text-white/70 mb-4">کیفیت</p>
          <h2 className="type-headline text-white max-w-lg mx-auto">
            ساخته‌شده برای پیشرفت
          </h2>
          <p className="mt-4 type-body text-white/80 max-w-sm mx-auto">
            هر قطعه با مواد منتخب و جزئیات دقیق طراحی شده تا سال‌ها همراه شما باشد.
          </p>
          <Link href="/about" className="inline-block mt-8 btn-primary bg-white text-foreground">
            داستان ما
          </Link>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <p className="type-label text-muted-foreground mb-1.5">پرطرفدار</p>
              <h2 className="type-headline">پرفروش‌ها</h2>
            </div>
            <Link
              href="/products"
              className="type-caption font-medium text-foreground underline underline-offset-4 hover:opacity-70"
            >
              مشاهده همه
            </Link>
          </div>
          <ProductGrid products={featured} />
        </Container>
      </section>

      <section className="bg-muted">
        <Container className="py-14 sm:py-18 text-center">
          <h2 className="type-headline mb-3">شروع کنید</h2>
          <p className="type-body text-muted-foreground max-w-md mx-auto mb-8">
            مجموعه کامل را ببینید و قطعه‌ای پیدا کنید که با سبک شما هماهنگ باشد.
          </p>
          <Link href="/products" className="btn-primary">
            ورود به فروشگاه
          </Link>
        </Container>
      </section>
    </div>
  );
}
