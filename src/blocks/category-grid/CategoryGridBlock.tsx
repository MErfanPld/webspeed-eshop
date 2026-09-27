import Image from "next/image";
import Link from "next/link";
import type {
  CategoryGridBlock as CategoryGridBlockType,
  PageBlock,
} from "@/builder/types";
import Container from "@/components/ui/Container";
import { formatNumber, cn } from "@/lib/utils";

export default function CategoryGridBlockView({
  block,
}: {
  block: PageBlock;
}) {
  const data = (block as CategoryGridBlockType).data;
  const cols = data.columns || 6;

  return (
    <section className="py-8 sm:py-12 bg-white">
      <Container>
        {(data.title || data.subtitle) && (
          <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
            <div>
              {data.title && (
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  {data.title}
                </h2>
              )}
              {data.subtitle && (
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {data.subtitle}
                </p>
              )}
            </div>
          </div>
        )}
        <ul
          className={cn(
            "grid gap-4 sm:gap-6",
            cols >= 6
              ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
              : cols === 4
                ? "grid-cols-2 sm:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3"
          )}
        >
          {data.categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-2.5 text-center"
              >
                <span className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full overflow-hidden bg-muted ring-1 ring-border group-hover:ring-primary/40 transition-all">
                  {cat.image && (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-400 group-hover:scale-105"
                      sizes="96px"
                    />
                  )}
                </span>
                <span>
                  <span className="block text-xs sm:text-sm font-semibold group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                  {typeof cat.count === "number" && (
                    <span className="block text-[10px] text-muted-foreground mt-0.5 num">
                      {formatNumber(cat.count)} کالا
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
