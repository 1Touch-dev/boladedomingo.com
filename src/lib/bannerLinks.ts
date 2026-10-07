import { site } from "@/config/site";

const escapedHost = site.domain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const absoluteSiteHref = new RegExp(`^https?:\\/\\/(?:www\\.)?${escapedHost}(?=$|[/?#])`, "i");

export const sameSitePath = (href: string): string | null => {
  const trimmed = href.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  const match = trimmed.match(absoluteSiteHref);
  if (!match) return null;
  const rest = trimmed.slice(match[0].length);
  if (!rest) return "/";
  return rest.startsWith("/") ? rest : `/${rest}`;
};

export const prepareBannerHtml = (html: string): string =>
  html.replace(/<a\b([^>]*?)>/gi, (full, attrs: string) => {
    const hrefMatch = attrs.match(/\bhref\s*=\s*(["'])([\s\S]*?)\1/i);
    if (!hrefMatch) return full;
    const path = sameSitePath(hrefMatch[2]);
    if (!path) return full;
    const quote = hrefMatch[1];
    let next = attrs.replace(hrefMatch[0], `href=${quote}${path}${quote}`);
    if (/\btarget\s*=/i.test(next)) {
      next = next.replace(/\btarget\s*=\s*(["'])[\s\S]*?\1/i, 'target="_top"');
    } else {
      next += ' target="_top"';
    }
    return `<a${next}>`;
  });
