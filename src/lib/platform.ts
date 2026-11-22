/** Platform URLs derived from PLATFORM_DOMAIN (server side). */
export type PlatformPlan = {
  slug: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  maxProducts: number | null;
  maxMembers: number | null;
  customDomain: boolean;
  highlighted: boolean;
};

export function platformConfig() {
  const domain = (process.env.PLATFORM_DOMAIN || "").trim().toLowerCase().replace(/^\.+|\.+$/g, "");
  const secure = process.env.NODE_ENV === "production";
  const scheme = secure ? "https" : "http";
  return {
    domain,
    /** central panel login */
    panelUrl: domain ? `${scheme}://${process.env.PANEL_SUBDOMAIN || "panel"}.${domain}/admin` : "/admin",
    /** prefix shown next to the subdomain input, e.g. ".webspeed.ir" */
    suffix: domain ? `.${domain}` : ".webspeed.ir",
    /** links inside the landing site (rewritten host or /platform in development) */
    base: domain ? "" : "/platform",
  };
}

export type LandingData = {
  settings: {
    heroBadge: string;
    heroTitle: string;
    heroHighlight: string;
    heroTitleEnd: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    videoTitle: string;
    videoText: string;
    videoUrl: string;
    videoFile: string;
    videoPoster: string;
    supportPhone: string;
    supportEmail: string;
    supportHours: string;
    instagram: string;
    telegram: string;
    enamadHtml: string;
  };
  stats: { stores: number; products: number; orders: number } | null;
  features: { icon: string; title: string; text: string }[];
  roadmap: { icon: string; when: string; title: string; text: string }[];
  faq: { q: string; a: string }[];
  testimonials: { name: string; role: string; text: string; rating: number; avatar: string; storeUrl: string }[];
  articles: ArticleSummary[];
  plans: PlatformPlan[];
  trialDays: number;
};

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  cover: string;
  publishedAt: string | null;
  readMinutes: number;
};

export type ArticleFull = ArticleSummary & { body: string; updatedAt: string | null };

/** Aparat / YouTube page links → privacy-friendly embed URLs; null for other links */
export function videoEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "aparat.com") {
      const hash = u.pathname.match(/\/v\/([^/]+)/)?.[1] ?? u.pathname.match(/videohash\/([^/]+)/)?.[1];
      return hash ? `https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame` : null;
    }
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v") ?? u.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function faDate(iso: string | null): string {
  return iso ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date(iso)) : "";
}
