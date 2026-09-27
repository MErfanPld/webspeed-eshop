"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqBlock as FaqBlockType, PageBlock } from "@/builder/types";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export default function FaqBlockView({ block }: { block: PageBlock }) {
  const data = (block as FaqBlockType).data;
  const [openId, setOpenId] = useState<string | null>(data.items[0]?.id ?? null);

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <Container className="max-w-3xl">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-8">
          {data.title}
        </h2>
        <ul className="space-y-2">
          {data.items.map((item) => {
            const open = openId === item.id;
            return (
              <li
                key={item.id}
                className="rounded-2xl border border-border bg-surface overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-right text-sm font-semibold"
                >
                  {item.question}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      open && "rotate-180"
                    )}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
