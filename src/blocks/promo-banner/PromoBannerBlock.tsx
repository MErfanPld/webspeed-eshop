import Image from "next/image";
import Link from "next/link";
import type {
  PromoBannerBlock as PromoBannerBlockType,
  PageBlock,
} from "@/builder/types";
import Container from "@/components/ui/Container";

export default function PromoBannerBlockView({
  block,
}: {
  block: PageBlock;
}) {
  const data = (block as PromoBannerBlockType).data;

  return (
    <section className="py-6 sm:py-10">
      <Container>
        <div className="group relative overflow-hidden rounded-3xl min-h-[220px] sm:min-h-[280px] bg-brand-gradient text-white shadow-xl shadow-primary/20">
          <span className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/15 blur-2xl ws-float" aria-hidden />
          <span className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-[#f97316]/30 blur-3xl" aria-hidden />
          {data.image && (
            <Image
              src={data.image}
              alt=""
              fill
              className="object-cover opacity-35 mix-blend-overlay transition-transform duration-[1.5s] group-hover:scale-105"
              sizes="100vw"
            />
          )}
          <div className="relative z-[1] flex flex-col items-start justify-center gap-3 p-8 sm:p-12 max-w-lg">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                {data.subtitle}
              </p>
            )}
            {data.ctaLabel && data.ctaHref && (
              <Link
                href={data.ctaHref}
                className="ws-shine mt-3 inline-flex h-12 items-center px-7 rounded-2xl bg-white text-primary text-sm font-extrabold shadow-lg hover:-translate-y-0.5 transition-transform"
              >
                {data.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
