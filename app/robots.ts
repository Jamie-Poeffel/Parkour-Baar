import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard/", "/auth-redirect", "/login"],
            },
            // Block common scrapers and AI crawlers
            {
                userAgent: [
                    "GPTBot",
                    "ChatGPT-User",
                    "Google-Extended",
                    "CCBot",
                    "anthropic-ai",
                    "Claude-Web",
                    "Applebot-Extended",
                    "FacebookBot",
                    "Bytespider",
                    "PetalBot",
                    "Scrapy",
                    "SemrushBot",
                    "AhrefsBot",
                    "MJ12bot",
                    "DotBot",
                ],
                disallow: "/",
            },
        ],
        sitemap: "https://parkourbaar.ch/sitemap.xml",
    };
}
