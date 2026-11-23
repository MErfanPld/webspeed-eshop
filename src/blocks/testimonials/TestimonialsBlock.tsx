import Image from "next/image";
import { Star } from "lucide-react";
import type {
  TestimonialsBlock as TestimonialsBlockType,
  PageBlock,
} from "@/builder/types";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export default function TestimonialsBlockView({
  block,
}: {
  block: PageBlock;
}) {
  const data = (block as TestimonialsBlockType).data;
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <h2 className="ws-heading text-xl sm:text-[1.7rem] font-extrabold tracking-tight text-center mb-8 sm:mb-10">
          {data.title}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {data.items.map((item) => (
            <li
              key={item.id}
              className="relative overflow-hidden rounded-3xl border border-border/70 bg-surface p-6 sm:p-7 space-y-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
            >
              {typeof item.rating === "number" && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < (item.rating || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-border"
                      )}
                    />
                  ))}
                </div>
              )}
              <span className="absolute -top-3 left-4 text-7xl font-black text-brand-gradient opacity-20 select-none" aria-hidden>”</span>
              <p className="text-sm leading-7 text-foreground/85">
                «{item.text}»
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="relative h-11 w-11 rounded-full overflow-hidden bg-brand-gradient ring-2 ring-white shadow">
                  {item.avatar && (
                    <Image
                      src={item.avatar}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  {item.role && (
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
