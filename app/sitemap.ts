import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const coreRoutes = [
  { path: "/", priority: 1 },
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
