"use client";

import { useState } from "react";
import type {
  NewsletterBlock as NewsletterBlockType,
  PageBlock,
} from "@/builder/types";
import Container from "@/components/ui/Container";

export default function NewsletterBlockView({
  block,
}: {
  block: PageBlock;
}) {
  const data = (block as NewsletterBlockType).data;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  };

  return (
    <section className="py-14 sm:py-20 bg-foreground text-background">
      <Container className="max-w-xl text-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="mt-2 text-sm text-background/70 leading-relaxed">
            {data.subtitle}
          </p>
        )}
        <form
          onSubmit={submit}
          className="mt-6 flex flex-col sm:flex-row gap-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={data.placeholder || "ایمیل"}
            dir="ltr"
            className="flex-1 h-12 rounded-full bg-background/10 border border-background/20 px-5 text-sm text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-background/30"
            required
          />
          <button
            type="submit"
            className="h-12 px-7 rounded-full bg-background text-foreground text-sm font-semibold hover:bg-background/90 shrink-0"
          >
            {done ? "ثبت شد ✓" : data.buttonLabel || "عضویت"}
          </button>
        </form>
      </Container>
    </section>
  );
}
