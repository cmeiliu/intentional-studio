import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const coreRoutes = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.9 },
  { path: "/ai-training", priority: 0.95 },
  { path: "/custom-apps", priority: 0.95 },
  { path: "/answers", priority: 0.9 },
  { path: "/work", priority: 0.85 },
  { path: "/guides", priority: 0.85 },
  { path: "/guides/ai-training-for-business-teams", priority: 0.88 },
  { path: "/guides/custom-ai-apps-for-business", priority: 0.88 },
  { path: "/learn", priority: 0.8 },
  { path: "/start", priority: 0.75 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return coreRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
