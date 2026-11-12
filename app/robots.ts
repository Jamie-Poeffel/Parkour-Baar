import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow search engines and AI search crawlers
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "PerplexityBot",
          "Applebot",
          "DuckAssistBot",
        ],
        allow: "/",
      },

      // Default rule for all other crawlers
      {
        userAgent: "*",
        allow: "/",
      },
    ],

    sitemap: "https://parkourbaar.ch/sitemap.xml",
  };
}
