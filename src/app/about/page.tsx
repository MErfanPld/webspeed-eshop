import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "فروشگاه اینترنتی WebSpeed — خرید آسان، ارسال سریع و ضمانت اصالت کالا.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[42vh] min-h-[280px] max-h-[420px] overflow-hidden bg-muted">
        <Image
          src="/placeholders/samsung-banner.webp"
          alt="درباره WebSpeed"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-center">
            درباره WebSpeed
          </h1>
        </div>
      </section>

      <Container className="py-12 sm:py-16 space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">داستان ما</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            WebSpeed یک فروشگاه اینترنتی مدرن است با تمرکز روی کیفیت، قیمت منصفانه
            و تجربه خرید ساده. از پوشاک تا کالای روزمره، هدف ما رساندن بهترین
            انتخاب‌ها با ارسال سریع و پشتیبانی واقعی است.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "ارسال سریع",
              text: "تحویل در کوتاه‌ترین زمان در سراسر کشور",
            },
            {
              title: "ضمانت اصالت",
              text: "تمام کالاها اصل و با گارانتی معتبر",
            },
            {
              title: "پشتیبانی",
              text: "شنبه تا پنج‌شنبه پاسخگوی شما هستیم",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-white p-6 text-center space-y-2"
            >
              <h3 className="font-bold text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button className="h-12 px-8 rounded-xl">مشاهده فروشگاه</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
