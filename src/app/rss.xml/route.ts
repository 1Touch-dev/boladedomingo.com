import { site } from "@/config/site";
import { loadDeskArticles } from "@/lib/deskArticles";
import { escapeXml } from "@/lib/xml";

export const revalidate = 120;

export const GET = async () => {
  const items = (await loadDeskArticles())
    .map((article) => {
      const link = `${site.url}/noticias/${article.slug}`;
      return `<item>
        <title>${escapeXml(article.title)}</title>
        <link>${link}</link>
        <guid>${link}</guid>
        <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
        <description>${escapeXml(article.excerpt)}</description>
      </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(site.name)}</title>
      <link>${site.url}</link>
      <description>${escapeXml(site.description)}</description>
      <language>pt-BR</language>
      <image>
        <url>${site.url.replace(/\/$/, "")}/logo.png</url>
        <title>${escapeXml(site.name)}</title>
        <link>${site.url.replace(/\/$/, "")}/</link>
      </image>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
