import type { Metadata } from "next";
import AboutDefault from "./AboutDefault";
import { overrideMetadata, renderWithOverride } from "@/lib/api/cms-page";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return overrideMetadata("/about", {
    title: "درباره ما",
    description: "خرید آسان، ارسال سریع و ضمانت اصالت کالا.",
  });
}

export default function AboutPage() {
  return renderWithOverride("/about", <AboutDefault />);
}
