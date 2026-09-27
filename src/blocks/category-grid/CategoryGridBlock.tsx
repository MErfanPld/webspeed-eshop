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
  const cols = data.columns || 4;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        {(data.title || data.subtitle) && (
          <div className="mb-8 sm:mb-10">
            {data.title && (
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className="mt-1.5 text-sm text-muted-foreground">
                {data.subtitle}
              </p>
            )}
          </div>
        )}
        <ul
          className={cn(
            "grid gap-3 sm:gap-4",
            cols === 2 && "grid-cols-2",
            cols === 3 && "grid-cols-2 md:grid-cols-3",
            cols === 4 && "grid-cols-2 md:grid-cols-4",
            cols === 6 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          )}
        >
          {data.categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="group relative block overflow-hidden rounded-2xl bg-concrete aspect-[4/5]"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <p className="font-semibold text-sm sm:text-base">{cat.name}</p>
                  {typeof cat.count === "number" && (
                    <p className="text-xs text-white/75 mt-0.5 num">
                      {formatNumber(cat.count)} کالا
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
