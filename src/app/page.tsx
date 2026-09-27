import type { Metadata } from "next";
import { PageRenderer } from "@/builder/BlockRenderer";
import { homePageConfig } from "@/config/home-page";

export const metadata: Metadata = {
  title: homePageConfig.title,
  description: homePageConfig.description,
};

/** Home is composition-driven. Edit blocks in src/config/home-page.ts */
export default function HomePage() {
  return <PageRenderer blocks={homePageConfig.blocks} />;
}
