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
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-8 sm:mb-10">
          {data.title}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {data.items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-4"
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
              <p className="text-sm leading-relaxed text-foreground/85">
                «{item.text}»
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="relative h-9 w-9 rounded-full overflow-hidden bg-muted">
                  {item.avatar && (
                    <Image
                      src={item.avatar}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="36px"
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
