import type { NextConfig } from "next";

/**
 * The browser talks to the Django API through this app's origin:
 *   /api/v1/*  → API_INTERNAL_URL/*        (JSON API, httpOnly JWT cookies)
 *   /media/*   → API origin /media/*       (local-storage media in development)
 * Same-origin requests keep the auth cookies first-party and avoid CORS.
 */
const API_INTERNAL_URL = (process.env.API_INTERNAL_URL || "http://localhost:8000/api/v1").replace(/\/+$/, "");
const API_ORIGIN = new URL(API_INTERNAL_URL).origin;

/** Public media hosts (MinIO/S3/CDN) allowed in next/image, comma-separated URLs */
const mediaPatterns = (process.env.MEDIA_PUBLIC_URLS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((u) => {
    const url = new URL(u);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: `${url.pathname.replace(/\/$/, "")}/**`,
    };
  });

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: mediaPatterns,
  },
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${API_INTERNAL_URL}/:path*` },
      { source: "/media/:path*", destination: `${API_ORIGIN}/media/:path*` },
    ];
  },
};

export default nextConfig;
