import type { ComponentType } from "react";
import type { FeaturesBlock as FeaturesBlockType, PageBlock } from "@/builder/types";
import Container from "@/components/ui/Container";
import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  truck: Truck,
  shield: Shield,
  refresh: RotateCcw,
  headset: Headphones,
};

export default function FeaturesBlockView({ block }: { block: PageBlock }) {
  const data = (block as FeaturesBlockType).data;
  return (
    <section className="border-b border-border bg-surface">
      <Container className="py-6 sm:py-8">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.items.map((item) => {
            const Icon = (item.icon && iconMap[item.icon]) || Truck;
            return (
              <li key={item.id} className="flex items-start gap-3 sm:gap-3.5">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
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
