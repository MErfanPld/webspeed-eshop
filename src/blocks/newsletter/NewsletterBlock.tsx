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
    <section className="relative isolate overflow-hidden py-16 sm:py-24 bg-brand-gradient text-white">
      <span className="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-white/15 blur-3xl -z-10 ws-float" aria-hidden />
      <span className="absolute -bottom-24 left-[-4rem] h-72 w-72 rounded-full bg-[#f97316]/30 blur-3xl -z-10" aria-hidden />
      <Container className="max-w-xl text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed">
            {data.subtitle}
          </p>
        )}
        <form
          onSubmit={submit}
          className="mt-8 flex flex-col sm:flex-row gap-2 rounded-2xl sm:bg-white/15 sm:backdrop-blur sm:p-2 sm:ring-1 sm:ring-white/25"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={data.placeholder || "ایمیل"}
            dir="ltr"
            className="flex-1 h-12 rounded-xl bg-white/15 sm:bg-transparent border border-white/30 sm:border-0 px-5 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
            required
          />
          <button
            type="submit"
            className="ws-shine h-12 px-8 rounded-xl bg-white text-primary text-sm font-extrabold shadow-lg shrink-0 hover:-translate-y-0.5 transition-transform"
          >
            {done ? "ثبت شد ✓" : data.buttonLabel || "عضویت"}
          </button>
        </form>
      </Container>
    </section>
  );
}
