import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/products/ProductGrid";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { getFeaturedProducts, getNewArrivals } from "@/data/products";
import { categories } from "@/data/categories";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 8);
  const newest = getNewArrivals().slice(0, 4);
  const cats = categories.filter((c) => c.id !== "all").slice(0, 4);

  return (
    <div className="no-x-scroll">
      <section className="relative h-[min(92vh,920px)] min-h-[520px] w-full overflow-hidden bg-foreground">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-foreground/25" />
        <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20 lg:pb-24">
          <p className="type-label text-white/70 mb-5">فصل جدید</p>
          <h1 className="type-display text-white max-w-[14ch]">
            کمتر.
            <br />
            بهتر.
          </h1>
          <p className="mt-5 type-body text-white/75 max-w-sm font-light">
            پوشاک مینیمال برای کسانی که کیفیت را به تعداد ترجیح می‌دهند.
          </p>
          <div className="mt-8 sm:mt-10">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-foreground hover:opacity-90 min-w-[10rem]"
              >
                مشاهده مجموعه
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Container className="py-16 sm:py-24 lg:py-30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="type-label text-muted-foreground mb-6">فلسفه</p>
          <h2 className="type-headline text-foreground">
            طراحی بدون زمان.
            <br />
            ساخته‌شده برای ماندن.
          </h2>
          <p className="mt-6 type-body text-muted-foreground max-w-md mx-auto">
            هر قطعه با دقت در پارچه، برش و جزئیات انتخاب می‌شود — برای سال‌ها، نه یک فصل.
          </p>
        </div>
      </Container>

      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <h2 className="type-headline">کاوش</h2>
            <Link
              href="/products"
              className="type-caption hidden sm:inline hover:text-foreground transition-colors"
            >
              همه محصولات
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
            {cats[0] && (
              <Link
                href={`/products?category=${cats[0].slug}`}
                className="lg:col-span-7 group relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[16/11] overflow-hidden bg-muted"
              >
                {cats[0].image && (
                  <Image
                    src={cats[0].image}
                    alt={cats[0].name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 50vw, 60vw"
                  />
                )}
                <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors duration-300" />
                <span className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 type-title text-white">
                  {cats[0].name}
                </span>
              </Link>
            )}
            {cats[1] && (
              <Link
                href={`/products?category=${cats[1].slug}`}
                className="lg:col-span-5 group relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:min-h-full overflow-hidden bg-muted"
              >
                {cats[1].image && (
                  <Image
                    src={cats[1].image}
                    alt={cats[1].name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 50vw, 40vw"
                  />
                )}
                <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors duration-300" />
                <span className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 type-title text-white">
                  {cats[1].name}
                </span>
              </Link>
            )}
            {cats[2] && (
              <Link
                href={`/products?category=${cats[2].slug}`}
                className="lg:col-span-5 group relative aspect-[4/5] overflow-hidden bg-muted"
              >
                {cats[2].image && (
                  <Image
                    src={cats[2].image}
                    alt={cats[2].name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 50vw, 40vw"
                  />
                )}
                <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors duration-300" />
                <span className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 type-title text-white">
                  {cats[2].name}
                </span>
              </Link>
            )}
            {cats[3] && (
              <Link
                href={`/products?category=${cats[3].slug}`}
                className="lg:col-span-7 group relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[16/11] overflow-hidden bg-muted"
              >
                {cats[3].image && (
                  <Image
                    src={cats[3].image}
                    alt={cats[3].name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 50vw, 60vw"
                  />
                )}
                <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors duration-300" />
                <span className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 type-title text-white">
                  {cats[3].name}
                </span>
              </Link>
            )}
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <p className="type-label text-muted-foreground mb-2">تازه</p>
              <h2 className="type-headline">جدیدترین‌ها</h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="type-caption hover:text-foreground transition-colors"
            >
              مشاهده همه
            </Link>
          </div>
          <ProductGrid products={newest} />
        </Container>
      </section>

      <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1800&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <Container className="relative text-center">
          <p className="type-label text-white/60 mb-6">کیفیت</p>
          <h2 className="type-headline text-white max-w-lg mx-auto">
            پارچه منتخب.
            <br />
            دوخت دقیق.
          </h2>
          <Link href="/about" className="inline-block mt-10">
            <Button
              size="lg"
              className="bg-white text-foreground hover:opacity-90"
            >
              داستان برند
            </Button>
          </Link>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <p className="type-label text-muted-foreground mb-2">انتخاب</p>
              <h2 className="type-headline">محصولات ویژه</h2>
            </div>
            <Link
              href="/products"
              className="type-caption hover:text-foreground transition-colors"
            >
              مشاهده همه
            </Link>
          </div>
          <ProductGrid products={featured} />
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <hr className="rule mb-16 sm:mb-20" />
          <div className="text-center max-w-md mx-auto">
            <h2 className="type-headline">شروع کنید</h2>
            <p className="mt-4 type-body text-muted-foreground">
              مجموعه را ببینید و قطعه‌ای را پیدا کنید که سال‌ها با شما بماند.
            </p>
            <Link href="/products" className="inline-block mt-8">
              <Button size="lg">فروشگاه</Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
