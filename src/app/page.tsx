import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/products/ProductGrid";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Newsletter from "@/components/home/Newsletter";
import { getFeaturedProducts, getNewArrivals } from "@/data/products";
import { categories } from "@/data/categories";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 8);
  const newest = getNewArrivals().slice(0, 4);
  const featuredCategories = categories.filter((c) => c.id !== "all").slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[440px] max-h-[780px] overflow-hidden bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt="مجموعه جدید WebSpeed"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-sm font-medium tracking-[0.2em] text-white/90 mb-4 uppercase">
            مجموعه جدید
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight max-w-2xl leading-[1.15]">
            سادگی، کیفیت، استایل
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/85 max-w-md">
            پوشاک مینیمال برای زندگی روزمره
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-neutral-100"
              >
                مشاهده محصولات
              </Button>
            </Link>
            <Link href="/products?gender=women">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                زنانه
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <Container className="py-16">
        <SectionHeading
          title="دسته‌بندی‌ها"
          subtitle="کاوش بر اساس سبک"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-muted"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              )}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
              <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                <h3 className="text-lg font-medium text-white">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* New arrivals */}
      <Container className="pb-16">
        <div className="flex items-end justify-between mb-8">
          <SectionHeading
            title="جدیدترین‌ها"
            subtitle="تازه رسیده‌ها"
            className="mb-0"
          />
          <Link
            href="/products?sort=newest"
            className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block"
          >
            مشاهده همه
          </Link>
        </div>
        <ProductGrid products={newest} />
      </Container>

      {/* Editorial */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <Container className="relative text-center text-white">
          <p className="text-sm tracking-[0.2em] uppercase mb-4 opacity-90">
            فلسفه ما
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold max-w-2xl mx-auto leading-tight">
            کمتر، اما بهتر
          </h2>
          <p className="mt-6 text-base sm:text-lg opacity-90 max-w-lg mx-auto leading-relaxed">
            ما به طراحی ماندگار، پارچه‌های باکیفیت و استایل بدون زمان اعتقاد
            داریم. هر قطعه برای سال‌ها ساخته شده است.
          </p>
          <Link href="/about" className="inline-block mt-8">
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-neutral-100"
            >
              داستان برند
            </Button>
          </Link>
        </Container>
      </section>

      {/* Featured */}
      <Container className="py-16">
        <div className="flex items-end justify-between mb-8">
          <SectionHeading
            title="محصولات ویژه"
            subtitle="انتخاب‌های محبوب"
            className="mb-0"
          />
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block"
          >
            مشاهده همه
          </Link>
        </div>
        <ProductGrid products={featured} />
      </Container>

      {/* Brand statement */}
      <section className="border-y border-border py-16">
        <Container className="text-center max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            کیفیت را احساس کنید
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
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
