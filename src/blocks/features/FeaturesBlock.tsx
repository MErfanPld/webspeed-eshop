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
    <section className="bg-transparent">
      <Container className="py-4 sm:py-5">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {data.items.map((item) => {
            const Icon = (item.icon && iconMap[item.icon]) || Truck;
            return (
              <li
                key={item.id}
                className="group flex items-center gap-3 rounded-2xl bg-surface border border-border/70 px-3 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-110 group-hover:-rotate-6">
                  <Icon className="h-5 w-5" />
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
