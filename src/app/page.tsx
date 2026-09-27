import type { Metadata } from "next";
import { homePageConfig } from "@/config/home-page";
import HomePageView from "@/components/home/HomePageView";
import type { PageBlock } from "@/builder/types";

export const metadata: Metadata = {
  title: homePageConfig.title,
  description: homePageConfig.description,
};

/**
 * Server Component: always provides config-based fallback.
 * Client HomePageView may upgrade to publishedBlocks after mount.
 */
export default function HomePage() {
  const fallbackBlocks = homePageConfig.blocks as PageBlock[];
  return <HomePageView fallbackBlocks={fallbackBlocks} />;
}
