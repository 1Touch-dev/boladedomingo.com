import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { articlesByDate, categorias, fixtures, pracas } from "@/data";
import { loadDeskArticles } from "@/lib/deskArticles";
import { loadDeskFixtures } from "@/lib/deskFixtures";

/** Build-time static sitemap so Google never hits a cold CMS/Lambda path. */
export const dynamic = "force-static";
export const revalidate = 3600;

const CMS_MS = 3500;
const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

const asDate = (value?: string): Date => {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : new Date();
};

const withTimeout = async <T>(promise: Promise<T>, fallback: T): Promise<T> => {
  const timedOut = Symbol("sitemap-timeout");
  try {
    const result = await Promise.race([
      promise,
      new Promise<typeof timedOut>((resolve) => {
        setTimeout(() => resolve(timedOut), CMS_MS);
      }),
    ]);
    return result === timedOut ? fallback : result;
  } catch {
    return fallback;
  }
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const seedArticles = articlesByDate();
  const articles = await withTimeout(loadDeskArticles(), seedArticles);
  const fixtureRows = await withTimeout(loadDeskFixtures(), fixtures);
  const now = new Date();
  const hubs = ["/noticias", "/pracas", "/tardes", "/calendario", "/resultados", "/categorias"];
  const quiet = ["/contato", "/sobre", "/privacidade", "/termos"];

  return [
    { url: site.url, lastModified: now, changeFrequency: "hourly", priority: 1 },
    ...hubs.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...quiet.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
    ...articles.map((article) => {
      const modified = asDate(article.updatedAt || article.publishedAt);
      const recent = now.getTime() - modified.getTime() <= TWO_DAYS;
      return {
        url: `${site.url}/noticias/${article.slug}`,
        lastModified: modified,
        changeFrequency: recent ? ("daily" as const) : ("weekly" as const),
        priority: recent ? 0.8 : 0.6,
      };
    }),
    ...pracas.map((praca) => ({
      url: `${site.url}/pracas/${praca.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...categorias.map((item) => ({
      url: `${site.url}/categorias/${item.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...fixtureRows.map((fixture) => ({
      url: `${site.url}/resultados/${fixture.id}`,
      lastModified: asDate(fixture.startsAt),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
};

export default sitemap;
