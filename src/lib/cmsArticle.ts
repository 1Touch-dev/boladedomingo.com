import { site } from "@/config/site";
import type { ICmsArticle } from "@/apis/articles/articles.type";

export interface ICmsFaq {
  question: string;
  answer: string;
}

export interface IYoutubeVideo {
  kind: "youtube";
  id: string;
}

export interface IExternalVideo {
  kind: "link";
  href: string;
}

export type IArticleVideo = IYoutubeVideo | IExternalVideo;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const categoriesOf = (category: ICmsArticle["category"]): string[] => {
  if (Array.isArray(category)) return category.filter((item): item is string => typeof item === "string" && item.length > 0);
  if (typeof category === "string" && category) return [category];
  return [];
};

export const isListedArticle = (article: ICmsArticle, now = Date.now()): boolean => {
  if (!article.slug || !article.title) return false;
  if (article.publishState === "needs_review" || article.publishState === "ready") return false;
  if (article.publishState === "published") return true;
  if (!article.scheduledTime) return true;
  const at = new Date(article.scheduledTime).getTime();
  if (Number.isNaN(at)) return true;
  return at <= now;
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const inlineMarkdown = (value: string) =>
  escapeHtml(value)
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n/g, "<br />");

const markdownToHtml = (source: string) =>
  source
    .trim()
    .split(/\n{2,}/)
    .filter((block) => block.trim())
    .map((block) => {
      const heading = block.match(/^(#{1,3})\s+([\s\S]+)$/);
      if (heading) {
        const level = heading[1].length;
        return `<h${level}>${inlineMarkdown(heading[2].trim())}</h${level}>`;
      }
      return `<p>${inlineMarkdown(block.trim())}</p>`;
    })
    .join("");

const dropBareYoutubeLines = (content: string) =>
  content
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!/youtube\.com\/watch|youtu\.be\/|youtube\.com\/embed/i.test(trimmed)) return true;
      const withoutUrl = trimmed.replace(/https?:\/\/\S+/gi, "").replace(/[<>[\]()/\s"']/g, "");
      return withoutUrl.length > 0;
    })
    .join("\n");

const lazyImages = (html: string) =>
  html.replace(/<img\b([^>]*?)(\/?)>/gi, (_match, attrs: string, slash: string) => {
    let next = attrs;
    if (!/\bloading\s*=/i.test(attrs)) next += ' loading="lazy" decoding="async"';
    if (!/\bwidth\s*=/i.test(attrs) && !/\bheight\s*=/i.test(attrs)) next += ' width="1200" height="675"';
    return `<img${next}${slash}>`;
  });

export const prepareArticleHtml = (content: string, videoUrls: string[]): string => {
  const withoutComments = content.replace(/<!--[\s\S]*?-->/g, "");
  const stripped = videoUrls.length > 0 ? dropBareYoutubeLines(withoutComments) : withoutComments;
  const html = /<\/?[a-z][\s\S]*>/i.test(stripped) ? stripped.trim() : markdownToHtml(stripped);
  return lazyImages(html);
};

const youtubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/i);
  return match?.[1] ?? null;
};

export const videosFrom = (urls: string[]): IArticleVideo[] =>
  urls
    .filter((url) => url.startsWith("http"))
    .map((url) => {
      const id = youtubeId(url);
      if (id) return { kind: "youtube", id } satisfies IYoutubeVideo;
      return { kind: "link", href: url } satisfies IExternalVideo;
    });

export const faqsFrom = (value: unknown): ICmsFaq[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.question !== "string" || typeof item.answer !== "string") return [];
    const question = item.question.trim();
    const answer = item.answer.trim();
    if (!question || !answer) return [];
    return [{ question, answer }];
  });
};

const schemaTypes = (value: unknown): string[] => {
  if (!isRecord(value)) return [];
  const raw = value["@type"];
  const own = typeof raw === "string" ? [raw] : Array.isArray(raw) ? raw.filter((item): item is string => typeof item === "string") : [];
  const graph = Array.isArray(value["@graph"]) ? value["@graph"].flatMap(schemaTypes) : [];
  return [...own, ...graph];
};

export const schemaHasFaq = (schema: unknown) => schemaTypes(schema).includes("FAQPage");

const keywordLine = (keywords: string[] | string | undefined): string => {
  if (Array.isArray(keywords)) return keywords.filter((item) => item.trim()).join(", ");
  if (typeof keywords === "string") return keywords.trim();
  return "";
};

export const coverFrom = (article: ICmsArticle): string | undefined => {
  const image = article.imageUrls?.find((url) => url.startsWith("http"));
  if (image) return image;
  return article.markdownImages?.find((url) => url.startsWith("http"));
};

export const jsonLdFor = (article: ICmsArticle, canonical: string): unknown[] => {
  const faq = faqsFrom(article.faq);
  const scripts: unknown[] = [];
  const schema = isRecord(article.schemaMarkup) ? article.schemaMarkup : null;

  if (schema) scripts.push(schema);
  else {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.seo?.meta_description || article.summary || article.description || "",
      inLanguage: "pt-BR",
      datePublished: article.createdAt,
      dateModified: article.updatedAt || article.createdAt,
      author: (article.authorNames ?? []).map((name) => ({ "@type": "Person", name })),
      image: coverFrom(article),
      mainEntityOfPage: canonical,
      publisher: {
        "@type": "NewsMediaOrganization",
        name: site.name,
        url: site.url,
        logo: { "@type": "ImageObject", url: `${site.url}/icon` },
      },
    });
  }

  if (faq.length > 0 && !schemaHasFaq(schema)) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return scripts;
};

export const metaTitleOf = (article: ICmsArticle) => article.seo?.meta_title?.trim() || article.title || "";

export const metaDescriptionOf = (article: ICmsArticle) => {
  const seo = article.seo?.meta_description?.trim();
  if (seo) return seo;
  const summary = article.summary?.trim() || article.description?.trim();
  if (summary) return summary;
  const plain = (article.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 180);
};

export const keywordsOf = (article: ICmsArticle) => keywordLine(article.seo?.keywords);

export const readCmsArticle = (value: unknown): ICmsArticle | null => {
  if (!isRecord(value)) return null;
  if (typeof value.title !== "string" && typeof value.slug !== "string") return null;
  return value as ICmsArticle;
};

export const readCmsList = (body: unknown): { rows: ICmsArticle[]; totalPages: number } => {
  if (Array.isArray(body)) return { rows: body.map(readCmsArticle).filter((row): row is ICmsArticle => row !== null), totalPages: 1 };
  if (!isRecord(body)) return { rows: [], totalPages: 1 };
  const rows = Array.isArray(body.data) ? body.data.map(readCmsArticle).filter((row): row is ICmsArticle => row !== null) : [];
  const meta = isRecord(body.meta) ? body.meta : {};
  const totalPages = typeof meta.totalPages === "number" && meta.totalPages > 0 ? meta.totalPages : 1;
  return { rows, totalPages };
};
