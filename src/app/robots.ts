import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const agents = [
  "*",
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "Amazonbot",
  "Meta-ExternalAgent",
  "DuckAssistBot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "Diffbot",
  "YouBot",
];

const robots = (): MetadataRoute.Robots => ({
  rules: agents.map((userAgent) => ({
    userAgent,
    allow: "/",
    disallow: ["/newsletter/unsubscribe"],
  })),
  sitemap: [`${site.url}/sitemap.xml`, `${site.url}/news-sitemap.xml`],
  host: site.url,
});

export default robots;
