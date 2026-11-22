import type { ICmsArticle } from "@/apis/articles/articles.type";
import { assignmentNames } from "@/lib/cmsArticle";
import { CategoriaSlugEnum } from "@/types";

/** Exact CMS `endpoint` query values from Postman "Brazil CMS — desk sites" → Bola de Domingo. */
export const HOME_ARTICLE_ENDPOINT = "HomePage";

export interface ICmsEndpoint {
  name: string;
  slug: string;
  /** Desk category when the feed maps into `/categorias/[slug]`. */
  categoria?: CategoriaSlugEnum;
  /** Public routes that should surface this feed as section notes. */
  hrefs?: string[];
}

/** Postman "Bola de Domingo" folder section feeds. */
export const cmsEndpoints: ICmsEndpoint[] = [
  {
    name: "Brasileirão",
    slug: "brasileirao",
    categoria: CategoriaSlugEnum.DOMINGO,
    hrefs: ["/categorias/domingo", "/resultados", "/calendario", "/pracas"],
  },
  {
    name: "Série B",
    slug: "serie-b",
    categoria: CategoriaSlugEnum.DOMINGO,
    hrefs: ["/categorias/domingo", "/resultados", "/pracas"],
  },
  {
    name: "Copa do Brasil",
    slug: "copa-do-brasil",
    categoria: CategoriaSlugEnum.COPA,
    hrefs: ["/categorias/copa", "/resultados"],
  },
  {
    name: "Libertadores",
    slug: "libertadores",
    categoria: CategoriaSlugEnum.TARDE,
    hrefs: ["/categorias/tarde", "/calendario"],
  },
  {
    name: "Seleção",
    slug: "selecao",
    categoria: CategoriaSlugEnum.SELECAO,
    hrefs: ["/categorias/selecao", "/calendario"],
  },
  {
    name: "Mercado da Bola",
    slug: "mercado-da-bola",
    categoria: CategoriaSlugEnum.MERCADO,
    hrefs: ["/categorias/mercado"],
  },
  {
    name: "Bastidores",
    slug: "bastidores",
    categoria: CategoriaSlugEnum.BASTIDORES,
    hrefs: ["/categorias/bastidores", "/tardes"],
  },
  {
    name: "Calendário",
    slug: "calendario",
    hrefs: ["/calendario"],
  },
  {
    name: "Tabela de classificação",
    slug: "tabela",
    hrefs: ["/pracas"],
  },
  {
    name: "Partidas",
    slug: "partidas",
    hrefs: ["/resultados"],
  },
  {
    name: "Equipes",
    slug: "equipes",
    hrefs: ["/pracas"],
  },
  {
    name: "Jogadores",
    slug: "jogadores",
    categoria: CategoriaSlugEnum.BASTIDORES,
    hrefs: ["/categorias/bastidores"],
  },
  {
    name: "Estaduais",
    slug: "estaduais",
    categoria: CategoriaSlugEnum.DOMINGO,
    hrefs: ["/categorias/domingo"],
  },
  {
    name: "Notícias",
    slug: "noticias",
    hrefs: ["/noticias"],
  },
  {
    name: "Other",
    slug: "other",
    hrefs: ["/noticias"],
  },
];

export interface IPublicFeed {
  name: string;
  slug: string;
}

/** Every Postman "Bola de Domingo" article request, including HomePage. Article-by-slug stays on `/noticias/[slug]`. */
export const publicArticleFeeds: IPublicFeed[] = [
  { name: HOME_ARTICLE_ENDPOINT, slug: "homepage" },
  ...cmsEndpoints.map((item) => ({ name: item.name, slug: item.slug })),
];

export const feedBySlug = (slug: string) => publicArticleFeeds.find((item) => item.slug === slug);

/** Home feed stays on the competition sections. The rest render on their own routes. */
const HOME_FEED = new Set([
  "Brasileirão",
  "Série B",
  "Copa do Brasil",
  "Libertadores",
  "Seleção",
  "Mercado da Bola",
]);

export const deskFeedEndpoints: string[] = cmsEndpoints
  .filter((item) => HOME_FEED.has(item.name))
  .map((item) => item.name);

const endpointKey = (value: string) => value.trim().toLowerCase();

export const isNoiseAssignment = (name: string) => {
  const key = name.trim().toLowerCase();
  return key === "league" || key === "other";
};

/**
 * Public list responses omit endpointAssignments. When the CMS still returns rows
 * for that endpoint (including the fallback feed where meta.total is 0), keep them.
 * Drop the body only when assignments are present and none match an empty section.
 */
export const selectEndpointRows = (endpoint: string, rows: ICmsArticle[], total: number | null): ICmsArticle[] => {
  if (endpoint === HOME_ARTICLE_ENDPOINT) {
    return rows.filter((row) => {
      const names = assignmentNames(row);
      if (names.length === 0) return true;
      return !names.every((name) => isNoiseAssignment(name));
    });
  }

  const target = endpointKey(endpoint);
  const named = rows.filter((row) => assignmentNames(row).length > 0);
  if (named.length > 0) {
    const matched = rows.filter((row) => assignmentNames(row).some((name) => endpointKey(name) === target));
    if (matched.length > 0) return matched;
    if (total === 0) return [];
  }

  return rows;
};

const byName = new Map(cmsEndpoints.map((item) => [item.name.toLowerCase(), item]));

export const cmsEndpointByName = (name: string) => byName.get(name.trim().toLowerCase());

export const endpointsForCategoria = (categoria: CategoriaSlugEnum): string[] =>
  cmsEndpoints.filter((item) => item.categoria === categoria).map((item) => item.name);

export const endpointsForHref = (href: string): string[] =>
  cmsEndpoints.filter((item) => item.hrefs?.includes(href)).map((item) => item.name);
