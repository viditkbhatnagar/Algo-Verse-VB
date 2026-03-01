import type { MetadataRoute } from "next";
import { getAllAlgorithms } from "@/data/algorithms";
import { getAllTerms } from "@/data/glossary";
import { getAllCategories } from "@/data/categories";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://algoverse.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/algorithms`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/glossary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/progress`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const categories = getAllCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/algorithms/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const algorithms = getAllAlgorithms();
  const algorithmPages: MetadataRoute.Sitemap = algorithms.map((algo) => ({
    url: `${BASE_URL}/algorithms/${algo.category}/${algo.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const terms = getAllTerms();
  const glossaryPages: MetadataRoute.Sitemap = terms.map((term) => ({
    url: `${BASE_URL}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...algorithmPages, ...glossaryPages];
}
