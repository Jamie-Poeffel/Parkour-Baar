import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { resolve } from "path";

const { version } = JSON.parse(
  readFileSync(resolve(process.cwd(), "package.json"), "utf-8"),
);

// Content-Security-Policy, sent in report-only mode first. Once the browser
// console shows no violations for legitimate traffic, switch the header key in
// headers() below to "Content-Security-Policy" to enforce it.
// 'unsafe-inline' is needed for Next.js inline bootstrap scripts and the
// consent-gated Google Analytics snippet until a nonce-based policy is added.
const clerkOrigins = "https://*.clerk.accounts.dev https://*.jamiepoeffel.ch";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${
    process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"
  } ${clerkOrigins} https://challenges.cloudflare.com https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://img.clerk.com https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  `connect-src 'self' ${clerkOrigins} https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com`,
  "frame-src https://www.google.com https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },

  // Strip console.log in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Fix the Google Analytics noise in dev
  async rewrites() {
    return [
      {
        source: "/gtag/:path*",
        destination: "https://www.googletagmanager.com/gtag/:path*",
      },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy-Report-Only", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Browsers remember to use HTTPS for a year (ignored over plain HTTP).
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
