import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/products/ProductGrid";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Newsletter from "@/components/home/Newsletter";
import { getFeaturedProducts, getNewArrivals } from "@/data/products";
import { categories } from "@/data/categories";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 8);
  const newest = getNewArrivals().slice(0, 4);
  const featuredCategories = categories
    .filter((c) => c.id !== "all")
    .slice(0, 4);

  return (
    <div className="overflow-x-hidden">
      <section className="relative h-[78vh] min-h-[480px] max-h-[860px] w-full overflow-hidden bg-[#1a1a1a]">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=80"
          alt="مجموعه جدید"
          fill
          priority
          className="object-cover object-center opacity-90"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-24 px-6 text-center">
          <p className="text-meta text-white/80 mb-4 tracking-[0.25em]">
            NEW SEASON
          </p>
          <h1 className="text-hero text-white max-w-3xl">
            سادگی، تعریف ماست
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/75 max-w-md font-light leading-relaxed">
            پوشاک مینیمال برای زندگی روزمره
          </p>
          <div className="mt-8 sm:mt-10">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 min-w-[180px]"
              >
                کشف مجموعه
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Container className="py-16 sm:py-20">
        <div className="mb-10 sm:mb-12">
          <h2 className="text-section text-foreground">دسته‌بندی‌ها</h2>
          <p className="mt-2 text-sm text-muted-foreground">کاوش بر اساس سبک</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {featuredCategories.map((cat) => (
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
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-end p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-medium text-white tracking-wide">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="pb-16 sm:pb-20">
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <h2 className="text-section text-foreground">جدیدترین‌ها</h2>
            <p className="mt-2 text-sm text-muted-foreground">تازه رسیده‌ها</p>
          </div>
          <Link
            href="/products?sort=newest"
            className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            مشاهده همه
          </Link>
        </div>
        <ProductGrid products={newest} />
      </Container>

      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <Container className="relative text-center text-white">
          <p className="text-meta text-white/70 mb-5 tracking-[0.25em]">
            PHILOSOPHY
          </p>
          <h2 className="text-section max-w-xl mx-auto">کمتر، اما بهتر</h2>
          <p className="mt-5 text-sm sm:text-base text-white/80 max-w-md mx-auto leading-relaxed font-light">
            ما به طراحی ماندگار، پارچه‌های باکیفیت و استایل بدون زمان اعتقاد
            داریم. هر قطعه برای سال‌ها ساخته شده است.
          </p>
          <Link href="/about" className="inline-block mt-8">
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90"
            >
              داستان برند
            </Button>
          </Link>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <h2 className="text-section text-foreground">محصولات ویژه</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              انتخاب‌های محبوب
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            مشاهده همه
          </Link>
        </div>
        <ProductGrid products={featured} />
      </Container>

      <section className="border-y border-border py-16 sm:py-20">
        <Container className="text-center max-w-xl">
          <h2 className="text-section text-foreground">کیفیت را احساس کنید</h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            پارچه‌های منتخب، دوخت تمیز و طراحی ماندگار برای هر روز. WebSpeed برای
            کسانی است که سادگی را ترجیح می‌دهند.
          </p>
          <Link href="/products" className="inline-block mt-8">
            <Button size="lg">شروع خرید</Button>
          </Link>
        </Container>
      </section>

      <Newsletter />
    </div>
  );
}
