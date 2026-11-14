import type { Metadata } from "next";
import ContactDefault from "./ContactDefault";
import { overrideMetadata, renderWithOverride } from "@/server/cms-page";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return overrideMetadata("/contact", { title: "تماس با ما", description: "راه‌های ارتباط با فروشگاه" });
}

export default function ContactPage() {
  return renderWithOverride("/contact", <ContactDefault />);
}
