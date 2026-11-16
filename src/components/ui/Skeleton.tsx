import { cn } from "@/lib/utils";

/** Shimmer placeholder; respects prefers-reduced-motion via globals.css */
export default function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("ws-skeleton rounded-lg bg-muted", className)} />;
}
