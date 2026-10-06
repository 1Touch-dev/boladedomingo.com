import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { categorias, pracas } from "@/data";
import { loadDeskArticles } from "@/lib/deskArticles";

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const articles = await loadDeskArticles();
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
      const modified = new Date(article.updatedAt || article.publishedAt);
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
  ];
};

export default sitemap;
