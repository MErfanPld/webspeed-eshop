import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "داستان برند WebSpeed — طراحی مینیمال، کیفیت ماندگار و استایل بدون زمان.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"
          alt="درباره WebSpeed"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight">
            درباره ما
          </h1>
        </div>
      </section>

      <Container className="py-16 sm:py-24 max-w-3xl">
        <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
          داستان برند
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-8">
          کمتر، اما بهتر
        </h2>
        <div className="space-y-6 text-muted-foreground leading-relaxed text-base sm:text-lg">
          <p>
            WebSpeed با این باور شکل گرفت که پوشاک خوب باید ساده، باکیفیت و
            ماندگار باشد. ما به جای دنبال کردن روندهای زودگذر، روی طراحی‌هایی
            تمرکز می‌کنیم که سال‌ها با شما بمانند.
          </p>
          <p>
            هر قطعه با دقت در انتخاب پارچه، دوخت و جزئیات ساخته می‌شود. هدف ما
            ایجاد کمد لباسی است که احساس سبکی و اطمینان می‌دهد — نه شلوغی و
            تصمیم‌گیری‌های بی‌پایان.
          </p>
        </div>
      </Container>

      <section className="bg-muted/40 py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              { value: "۱۰۰٪", label: "پارچه منتخب" },
              { value: "۲۴+", label: "مدل در مجموعه" },
              { value: "۷ روز", label: "ضمانت مرجوعی" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="فلسفه طراحی"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
              فلسفه
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">
              طراحی بدون زمان
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              ما معتقدیم مد خوب نیاز به فریاد زدن ندارد. خطوط تمیز، رنگ‌های
              خنثی و تناسب درست — این‌ها پایه‌های استایلی هستند که همیشه کار
              می‌کند.
            </p>
            <Link href="/products">
              <Button size="lg">کاوش مجموعه</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
