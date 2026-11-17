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
