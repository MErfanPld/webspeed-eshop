import type { ComponentType } from "react";
import type { FeaturesBlock as FeaturesBlockType, PageBlock } from "@/builder/types";
import Container from "@/components/ui/Container";
import { Truck, Shield, RotateCcw, Headphones, CreditCard } from "lucide-react";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  truck: Truck,
  shield: Shield,
  refresh: RotateCcw,
  headset: Headphones,
  card: CreditCard,
};

export default function FeaturesBlockView({ block }: { block: PageBlock }) {
  const data = (block as FeaturesBlockType).data;
  return (
    <section className="border-y border-border bg-white">
      <Container className="py-4 sm:py-5">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {data.items.map((item) => {
            const Icon = (item.icon && iconMap[item.icon]) || Truck;
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
