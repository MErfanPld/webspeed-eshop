"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Image,
  Megaphone,
  Timer,
  LayoutList,
  LayoutGrid,
  GitBranch,
  FolderTree,
  Award,
  Shield,
  HelpCircle,
  MessageSquareQuote,
  Mail,
  Plus,
} from "lucide-react";
import {
  blockRegistry,
  categoryLabels,
} from "@/builder/registry/block-registry";
import { useBuilderStore } from "@/builder/store/builder-store";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Image,
  Megaphone,
  Timer,
  LayoutList,
  LayoutGrid,
  GitBranch,
  FolderTree,
  Award,
  Shield,
  HelpCircle,
  MessageSquareQuote,
  Mail,
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
      <div className="p-3 border-b border-border space-y-2">
        <h2 className="text-xs font-bold tracking-wide text-muted-foreground">
          کتابخانه بلوک‌ها
        </h2>
        <div className="relative">
          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی بلوک..."
            className="w-full h-9 rounded-lg border border-border bg-white pr-8 pl-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "px-2 py-1 rounded-md text-[11px] font-medium transition-colors",
                cat === c
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {c === "all" ? "همه" : categoryLabels[c] || c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.map((block) => {
          const Icon = ICONS[block.icon] || LayoutGrid;
          return (
            <button
              key={block.type}
              type="button"
              onClick={() => addBlock(block.type)}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:border-border hover:bg-white text-right transition-all group"
            >
              <span className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                <Icon className="h-4 w-4 text-foreground/70" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-foreground">
                  {block.nameFa}
                </span>
                <span className="block text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                  {block.description}
                </span>
              </span>
              <Plus className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 mt-1 shrink-0" />
            </button>
          );
        })}
        {!filtered.length && (
          <p className="text-xs text-muted-foreground text-center py-8">
            بلوکی یافت نشد
          </p>
        )}
      </div>
    </div>
  );
}
