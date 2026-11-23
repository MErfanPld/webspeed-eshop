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
    <section className="py-10 sm:py-14">
      <Container>
        {(data.title || data.subtitle) && (
          <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
            <div>
              {data.title && (
                <h2 className="ws-heading text-xl sm:text-[1.7rem] font-extrabold tracking-tight">
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
                {/* Gradient ring that spins on hover */}
                <span className="relative grid place-items-center h-[4.5rem] w-[4.5rem] sm:h-[5.5rem] sm:w-[5.5rem] lg:h-[6.5rem] lg:w-[6.5rem] rounded-full p-[3px] bg-[conic-gradient(from_180deg,var(--primary),var(--accent),#f97316,var(--primary))] shadow-md shadow-primary/10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
                <span className="relative h-full w-full rounded-full overflow-hidden bg-muted ring-[3px] ring-white">
                  {cat.image && (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover object-left transition-transform duration-400 group-hover:scale-105"
                      sizes="96px"
                    />
                  )}
                </span>
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
