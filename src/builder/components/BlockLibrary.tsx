"use client";

import { useMemo, useState } from "react";
import {
  Search, Megaphone, PanelTop, PanelBottom, RectangleHorizontal, Square, Columns3, Rows3,
  LayoutGrid, Columns2, MoveVertical, Minus, GalleryHorizontal, Timer, MousePointerClick,
  Hourglass, ShoppingCart, GalleryHorizontalEnd, Star, TrendingUp, Sparkles, GitBranch,
  FolderTree, Award, Cloud, Heading, Pilcrow, FileText, RectangleEllipsis, Image, Video,
  BadgeCheck, Quote, ChartNoAxesColumn, HelpCircle, ListCollapse, PanelsTopLeft,
  ChevronsLeft, FileX, Shield, ShieldCheck, ListChecks, MessageSquareQuote, Mail, MailPlus,
  Send, LogIn, Plus,
} from "lucide-react";
import {
  blockRegistry,
  categoryLabels,
} from "@/builder/registry/block-registry";
import type { BlockCategory } from "@/builder/schema-types";
import { useBuilderStore } from "@/builder/store/builder-store";
import { cancelDrag, startDrag } from "@/builder/dnd/drag-state";
import { touchDragStart } from "@/builder/dnd/touch-drag";
import SavedBlocksSection from "./SavedBlocksSection";
import { cn } from "@/lib/utils";

export const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Search, Megaphone, PanelTop, PanelBottom, RectangleHorizontal, Square, Columns3, Rows3,
  LayoutGrid, Columns2, MoveVertical, Minus, GalleryHorizontal, Timer, MousePointerClick,
  Hourglass, ShoppingCart, GalleryHorizontalEnd, Star, TrendingUp, Sparkles, GitBranch,
  FolderTree, Award, Cloud, Heading, Pilcrow, FileText, RectangleEllipsis, Image, Video,
  BadgeCheck, Quote, ChartNoAxesColumn, HelpCircle, ListCollapse, PanelsTopLeft,
  ChevronsLeft, FileX, Shield, ShieldCheck, ListChecks, MessageSquareQuote, Mail, MailPlus,
  Send, LogIn,
};

export default function BlockLibrary() {
  const addBlock = useBuilderStore((s) => s.addBlock);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(blockRegistry.map((b) => b.category));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return blockRegistry.filter((b) => {
      if (cat !== "all" && b.category !== cat) return false;
      if (!q.trim()) return true;
      const s = q.trim().toLowerCase();
      return (
        b.nameFa.includes(q.trim()) ||
        b.name.toLowerCase().includes(s) ||
        b.description.includes(q.trim())
      );
    });
  }, [q, cat]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border space-y-2 shrink-0">
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              // Enter adds the first match: search → Enter is the fastest way to add a block
              if (e.key === "Enter" && filtered[0]) addBlock(filtered[0].type);
            }}
            placeholder="جستجوی بلوک... (Enter برای افزودن)"
            aria-label="جستجوی بلوک"
            className="w-full h-9 rounded-lg border border-border bg-[#F7F9FB] pr-9 pl-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111]/10"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-0.5 -mx-1 px-1 [scrollbar-width:none]" role="tablist" aria-label="دسته‌بندی بلوک‌ها">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 px-2.5 h-7 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap",
                cat === c ? "bg-[#111] text-white" : "bg-[#F0F3F6] text-[#5A6A85] hover:text-[#111]"
              )}
            >
              {c === "all" ? "همه" : categoryLabels[c as BlockCategory] || c}
            </button>
          ))}
        </div>
      </div>

      <SavedBlocksSection />

      <div className="flex-1 overflow-y-auto p-2">
        <p className="px-1 pb-2 text-[10px] text-muted-foreground leading-4">
          کلیک: افزودن بعد از بلوک انتخاب‌شده · کشیدن: رها کردن در بوم (لمسی: کمی نگه دارید)
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {filtered.map((block) => {
            const Icon = ICONS[block.icon] || LayoutGrid;
            return (
              <button
                key={block.type}
                type="button"
                draggable
                onDragStart={(e) => startDrag(e, { kind: "new", type: block.type })}
                onDragEnd={() => cancelDrag()}
                onPointerDown={(e) => touchDragStart(e, { kind: "new", type: block.type }, block.nameFa)}
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => addBlock(block.type)}
                title={block.description}
                data-block-type={block.type}
                className="group relative flex flex-col items-center justify-center gap-1.5 h-[76px] px-1.5 rounded-xl border border-[#E5EAEF] bg-white hover:border-[#111]/30 hover:shadow-sm text-center transition-all cursor-grab active:cursor-grabbing select-none"
              >
                <span className="h-8 w-8 rounded-lg bg-[#F0F3F6] flex items-center justify-center group-hover:bg-[#111] group-hover:text-white transition-colors">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="block text-[11px] font-semibold text-foreground leading-tight line-clamp-2">{block.nameFa}</span>
                <Plus className="absolute top-1.5 left-1.5 h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </button>
            );
          })}
        </div>
        {!filtered.length && <p className="text-xs text-muted-foreground text-center py-8">بلوکی یافت نشد</p>}
      </div>
    </div>
  );
}
