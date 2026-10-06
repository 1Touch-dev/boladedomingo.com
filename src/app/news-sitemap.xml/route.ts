import { site } from "@/config/site";
import { loadDeskArticles } from "@/lib/deskArticles";
import { escapeXml } from "@/lib/xml";

export const revalidate = 120;

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

export const GET = async () => {
  const cutoff = Date.now() - TWO_DAYS;
  const items = (await loadDeskArticles())
    .filter((article) => new Date(article.publishedAt).getTime() >= cutoff)
    .map((article) => {
      const loc = `${site.url}/noticias/${article.slug}`;
      return `<url>
        <loc>${loc}</loc>
        <news:news>
          <news:publication>
            <news:name>${escapeXml(site.name)}</news:name>
            <news:language>pt</news:language>
          </news:publication>
          <news:publication_date>${new Date(article.publishedAt).toISOString()}</news:publication_date>
          <news:title>${escapeXml(article.title)}</news:title>
        </news:news>
      </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
    ${items}
  </urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
