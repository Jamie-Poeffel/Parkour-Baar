import type { MetadataRoute } from "next";
import { db } from "@/utils/firebase-admin";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://parkourbaar.ch";

  const homepageDoc = await db.collection("site").doc("data").get();

  const data = homepageDoc.data();

  const lastModified = data?.lastModified?.toDate?.() ?? new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
