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
  // Docker image (see Dockerfile) builds a minimal self-contained server
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Tree-shake icon/utility imports so each page ships only what it uses
    optimizePackageImports: ["lucide-react", "clsx"],
  },
  async headers() {
    return [
      {
        // Self-hosted fonts and static images never change for a given name
        source: "/fonts/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/placeholders/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
