import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { resolve } from "path";
import { withAxiom } from "next-axiom";

const { version } = JSON.parse(
    readFileSync(resolve(process.cwd(), "package.json"), "utf-8"),
);

const nextConfig: NextConfig = {
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
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
        ];
    },
};

export default withAxiom(nextConfig);