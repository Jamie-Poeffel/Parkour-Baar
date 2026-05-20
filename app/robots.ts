import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/dashboard/", "/auth-redirect", "/login"],
        },
        sitemap: "https://parkourbaar.ch/sitemap.xml",
    };
}
