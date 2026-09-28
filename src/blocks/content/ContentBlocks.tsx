"use client";

import Link from "next/link";
import type { PageBlock } from "@/builder/types";
import { BlockRenderer } from "@/builder/BlockRenderer";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Props = { block: PageBlock };
type Data = Record<string, unknown>;

function d(block: PageBlock): Data {
  return ((block as { data?: Data }).data || {}) as Data;
}

function childrenOf(block: PageBlock): PageBlock[] {
  const c = d(block).children;
  return Array.isArray(c) ? (c as PageBlock[]) : [];
}

export function HeadingBlock({ block }: Props) {
  const data = d(block);
  const text = String(data.text ?? "\u0639\u0646\u0648\u0627\u0646");
  const level = Number(data.level ?? 2);
  const align = String(data.align ?? "right") as "right" | "center" | "left";
  const Tag = (`h${Math.min(Math.max(level, 1), 4)}` as "h1" | "h2" | "h3" | "h4");
  const sizes: Record<number, string> = {
    1: "text-3xl sm:text-4xl",
    2: "text-2xl sm:text-3xl",
    3: "text-xl sm:text-2xl",
    4: "text-lg",
  };
  return (
    <div className="w-full px-4 sm:px-6 py-3" style={{ textAlign: align }}>
      <Tag className={`font-bold tracking-tight text-foreground ${sizes[level] || sizes[2]}`}>
        {text}
      </Tag>
    </div>
  );
}

export function TextBlock({ block }: Props) {
  const data = d(block);
  return (
    <div
      className="w-full px-4 sm:px-6 py-2"
      style={{ textAlign: String(data.align ?? "right") as "right" }}
    >
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
        {String(data.text ?? "")}
      </p>
    </div>
  );
}

export function ButtonBlock({ block }: Props) {
  const data = d(block);
  const label = String(data.label ?? "\u062f\u06a9\u0645\u0647");
  const href = String(data.href ?? "#");
  const variant = String(data.variant ?? "primary");
  const cls =
    variant === "secondary"
      ? "bg-white text-foreground border border-border hover:bg-muted"
      : variant === "ghost"
        ? "bg-transparent text-foreground hover:bg-muted"
        : "bg-[#111] text-white hover:bg-black";
  return (
    <div
      className="w-full px-4 sm:px-6 py-3 flex"
      style={{
        justifyContent:
          String(data.align ?? "start") === "center" ? "center" : "flex-start",
      }}
    >
      <Link
        href={href}
        className={`inline-flex h-11 items-center px-6 rounded-lg text-sm font-semibold transition-colors ${cls}`}
      >
        {label}
      </Link>
    </div>
  );
}

export function BadgeBlock({ block }: Props) {
  const data = d(block);
  return (
    <div className="px-4 sm:px-6 py-2">
      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-[#E31B23]/10 text-[#E31B23]">
        {String(data.text ?? "\u0646\u0634\u0627\u0646")}
      </span>
    </div>
  );
}

export function QuoteBlock({ block }: Props) {
  const data = d(block);
  return (
    <blockquote className="mx-auto max-w-2xl px-6 py-8 text-center">
      <p className="text-lg sm:text-xl font-medium leading-relaxed text-foreground">
        \u00ab{String(data.text ?? "")}\u00bb
      </p>
      {data.author ? (
        <footer className="mt-3 text-sm text-muted-foreground">
          \u2014 {String(data.author)}
        </footer>
      ) : null}
    </blockquote>
  );
}

export function VideoBlock({ block }: Props) {
  const data = d(block);
  const url = String(data.url ?? "");
  return (
    <div className="w-full px-4 sm:px-6 py-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
        {url ? (
          <iframe
            src={url}
            title={String(data.title ?? "\u0648\u06cc\u062f\u06cc\u0648")}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            \u0622\u062f\u0631\u0633 \u0648\u06cc\u062f\u06cc\u0648 \u0631\u0627 \u062a\u0646\u0638\u06cc\u0645 \u06a9\u0646\u06cc\u062f
          </div>
        )}
      </div>
    </div>
  );
}

export function CtaBlock({ block }: Props) {
  const data = d(block);
  return (
    <section className="w-full px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-[#111] text-white px-6 py-10 sm:px-10 sm:py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {String(data.title ?? "\u0647\u0645\u06cc\u0646 \u062d\u0627\u0644\u0627 \u0634\u0631\u0648\u0639 \u06a9\u0646\u06cc\u062f")}
        </h2>
        {data.subtitle ? (
          <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">
            {String(data.subtitle)}
          </p>
        ) : null}
        <Link
          href={String(data.href ?? "/products")}
          className="mt-6 inline-flex h-11 items-center px-6 rounded-lg bg-white text-[#111] text-sm font-bold hover:bg-white/90"
        >
          {String(data.buttonLabel ?? "\u0645\u0634\u0627\u0647\u062f\u0647 \u0641\u0631\u0648\u0634\u06af\u0627\u0647")}
        </Link>
      </div>
    </section>
  );
}

export function StatsBlock({ block }: Props) {
  const data = d(block);
  const items = (Array.isArray(data.items)
    ? data.items
    : [
        { value: "10k+", label: "\u0645\u0634\u062a\u0631\u06cc" },
        { value: "500+", label: "\u0645\u062d\u0635\u0648\u0644" },
        { value: "98%", label: "\u0631\u0636\u0627\u06cc\u062a" },
      ]) as { value: string; label: string }[];
  return (
    <section className="w-full px-4 sm:px-6 py-10 border-y border-border bg-[#fafafa]">
      <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
        {items.map((it, i) => (
          <div key={i}>
            <p className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">{it.value}</p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CountdownBlock({ block }: Props) {
  const data = d(block);
  const target = String(data.targetDate ?? "");
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      const s = Math.floor(diff / 1000);
      setLeft({
        d: Math.floor(s / 86400),
        h: Math.floor((s % 86400) / 3600),
        m: Math.floor((s % 3600) / 60),
        s: s % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells = [
    { v: left.d, l: "\u0631\u0648\u0632" },
    { v: left.h, l: "\u0633\u0627\u0639\u062a" },
    { v: left.m, l: "\u062f\u0642\u06cc\u0642\u0647" },
    { v: left.s, l: "\u062b\u0627\u0646\u06cc\u0647" },
  ];

  return (
    <section className="w-full px-4 sm:px-6 py-8 text-center">
      <p className="text-sm font-semibold text-foreground mb-4">
        {String(data.title ?? "\u0632\u0645\u0627\u0646 \u0628\u0627\u0642\u06cc\u200c\u0645\u0627\u0646\u062f\u0647")}
      </p>
      <div className="inline-flex gap-2 sm:gap-3">
        {cells.map((c) => (
          <div key={c.l} className="min-w-[3.5rem] rounded-xl bg-[#111] text-white px-3 py-2">
            <p className="text-lg font-bold tabular-nums">{String(c.v).padStart(2, "0")}</p>
            <p className="text-[10px] text-white/60">{c.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AccordionBlock({ block }: Props) {
  const data = d(block);
  const items = (Array.isArray(data.items)
    ? data.items
    : [
        { q: "Q1", a: "A1" },
        { q: "Q2", a: "A2" },
      ]) as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-2">
      {data.title ? (
        <h3 className="text-lg font-bold mb-4">{String(data.title)}</h3>
      ) : null}
      {items.map((it, i) => (
        <div key={i} className="border border-border rounded-xl overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-right"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{it.q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{it.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function TabsBlock({ block }: Props) {
  const data = d(block);
  const tabs = (Array.isArray(data.tabs)
    ? data.tabs
    : [
        { label: "Tab 1", content: "Content 1" },
        { label: "Tab 2", content: "Content 2" },
      ]) as { label: string; content: string }[];
  const [active, setActive] = useState(0);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
      <div className="flex gap-1 border-b border-border mb-4 overflow-x-auto">
        {tabs.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
              active === i
                ? "border-[#111] text-[#111]"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
        {tabs[active]?.content}
      </p>
    </div>
  );
}

export function LogoCloudBlock({ block }: Props) {
  const data = d(block);
  const logos = (Array.isArray(data.logos)
    ? data.logos
    : ["Brand A", "Brand B", "Brand C", "Brand D"]) as string[];
  return (
    <section className="w-full px-4 sm:px-6 py-10 border-y border-border bg-[#fafafa]">
      {data.title ? (
        <p className="text-center text-xs font-semibold text-muted-foreground mb-6 uppercase tracking-wider">
          {String(data.title)}
        </p>
      ) : null}
      <div className="mx-auto max-w-4xl flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {logos.map((name, i) => (
          <span key={i} className="text-sm font-bold text-foreground/40 tracking-wide">
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

export function GridBlock({ block }: Props) {
  const data = d(block);
  const cols = Number(data.columns ?? 3);
  const gap = Number(data.gap ?? 16);
  return (
    <div
      className="w-full px-4 sm:px-6 py-4 grid"
      style={{
        gridTemplateColumns: `repeat(${Math.min(Math.max(cols, 1), 6)}, minmax(0, 1fr))`,
        gap,
      }}
    >
      {childrenOf(block).map((c) => (
        <BlockRenderer key={c.id} block={c} />
      ))}
    </div>
  );
}

export function FlexBlock({ block }: Props) {
  const data = d(block);
  return (
    <div
      className="w-full px-4 sm:px-6 py-4 flex flex-wrap"
      style={{
        gap: Number(data.gap ?? 16),
        justifyContent: String(data.justify ?? "flex-start"),
        alignItems: String(data.align ?? "center"),
      }}
    >
      {childrenOf(block).map((c) => (
        <BlockRenderer key={c.id} block={c} />
      ))}
    </div>
  );
}

export function ReviewsBlock({ block }: Props) {
  const data = d(block);
  const items = (Array.isArray(data.items)
    ? data.items
    : [
        { name: "User", text: "Great product.", rating: 5 },
        { name: "User2", text: "Fast delivery.", rating: 4 },
      ]) as { name: string; text: string; rating: number }[];
  return (
    <section className="w-full px-4 sm:px-6 py-10">
      <h3 className="text-lg font-bold mb-6 text-center">
        {String(data.title ?? "Reviews")}
      </h3>
      <div className="mx-auto max-w-4xl grid sm:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border border-border bg-white p-5">
            <p className="text-amber-400 text-sm mb-2">{"\u2605".repeat(it.rating || 5)}</p>
            <p className="text-sm text-foreground leading-relaxed">{it.text}</p>
            <p className="mt-3 text-xs font-semibold text-muted-foreground">{it.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AddToCartBannerBlock({ block }: Props) {
  const data = d(block);
  return (
    <div className="w-full px-4 sm:px-6 py-4">
      <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-white p-4 sm:p-5">
        <div>
          <p className="text-sm font-bold">{String(data.title ?? "Featured")}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {String(data.subtitle ?? "In stock")}
          </p>
        </div>
        <Link
          href={String(data.href ?? "/products")}
          className="h-10 px-5 rounded-lg bg-[#111] text-white text-sm font-semibold inline-flex items-center hover:bg-black"
        >
          {String(data.buttonLabel ?? "Add to cart")}
        </Link>
      </div>
    </div>
  );
}
