"use client";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PageRenderer } from "@/builder/rendering/PageRenderer";
import type { PageBlock } from "@/builder/types";

/**
 * Global site header. When the merchant has published a custom header
 * (page `site-header`) its blocks replace the built-in Navbar.
 */
export function SiteHeader({ blocks }: { blocks?: PageBlock[] | null }) {
  if (blocks?.length) {
    return (
      <header data-site-header="custom">
        <PageRenderer blocks={blocks} />
      </header>
    );
  }
  return (
    <div data-site-header="default">
      <AnnouncementBar />
      <Navbar />
    </div>
  );
}

export function SiteFooter({ blocks }: { blocks?: PageBlock[] | null }) {
  if (blocks?.length) {
    return (
      <div data-site-footer="custom">
        <PageRenderer blocks={blocks} />
      </div>
    );
  }
  return (
    <div data-site-footer="default">
      <Footer />
    </div>
  );
}
