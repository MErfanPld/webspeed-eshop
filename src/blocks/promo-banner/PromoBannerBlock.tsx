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
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[200px] sm:min-h-[260px] bg-foreground text-background">
          {data.image && (
            <Image
              src={data.image}
              alt=""
              fill
              className="object-cover opacity-40"
              sizes="100vw"
            />
          )}
          <div className="relative z-[1] flex flex-col items-start justify-center gap-3 p-8 sm:p-12 max-w-lg">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="text-sm text-background/80 leading-relaxed">
                {data.subtitle}
              </p>
            )}
            {data.ctaLabel && data.ctaHref && (
              <Link
                href={data.ctaHref}
                className="mt-2 inline-flex h-11 items-center px-6 rounded-full bg-background text-foreground text-sm font-semibold hover:bg-background/90"
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
