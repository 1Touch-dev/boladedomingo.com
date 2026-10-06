import { cache } from "react";
import { envConfig } from "@/config/env";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export interface IEditorialBanner {
  type: "image" | "html";
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  url: string;
  htmlContent: string;
}

export interface IPartnerBanner {
  position: string;
  imageUrl: string;
  linkUrl: string;
  partnerName: string;
  startDate?: string;
  endDate?: string;
}

const asText = (value: unknown) => (typeof value === "string" ? value : "");

const editorialFrom = (value: unknown): IEditorialBanner | null => {
  if (!isRecord(value)) return null;
  const type = value.type === "html" ? "html" : "image";
  const banner: IEditorialBanner = {
    type,
    title: asText(value.title),
    description: asText(value.description),
    ctaLabel: asText(value.ctaLabel),
    ctaUrl: asText(value.ctaUrl),
    url: asText(value.url),
    htmlContent: asText(value.htmlContent),
  };
  if (type === "html" && !banner.htmlContent) return null;
  if (type === "image" && !banner.url) return null;
  return banner;
};

export const loadEditorialBanners = cache(async (): Promise<IEditorialBanner[]> => {
  try {
    const response = await fetch(`${envConfig.apiBaseUrl}/banners/public/${envConfig.targetWebsite}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (response.status === 404 || !response.ok) return [];
    const body: unknown = await response.json();
    if (!isRecord(body)) return [];
    const many = Array.isArray(body.banners) ? body.banners.map(editorialFrom).filter((item): item is IEditorialBanner => item !== null) : [];
    if (many.length > 0) return many.slice(0, 20);
    const primary = editorialFrom(body.banner);
    return primary ? [primary] : [];
  } catch {
    return [];
  }
});

export const partnerIsLive = (banner: IPartnerBanner, now = Date.now()): boolean => {
  if (banner.startDate) {
    const start = new Date(banner.startDate).getTime();
    if (!Number.isNaN(start) && now < start) return false;
  }
  if (banner.endDate) {
    const end = new Date(banner.endDate).getTime();
    if (!Number.isNaN(end) && now >= end) return false;
  }
  return banner.imageUrl.startsWith("http");
};

const partnerFrom = (value: unknown): IPartnerBanner | null => {
  if (!isRecord(value)) return null;
  const imageUrl = asText(value.imageUrl);
  if (!imageUrl) return null;
  return {
    position: asText(value.position),
    imageUrl,
    linkUrl: asText(value.linkUrl),
    partnerName: asText(value.partnerName) || "Parceiro",
    startDate: asText(value.startDate) || undefined,
    endDate: asText(value.endDate) || undefined,
  };
};

export const loadPartnerBanners = cache(async (position: string): Promise<IPartnerBanner[]> => {
  try {
    const url = new URL(`${envConfig.apiBaseUrl}/partnerships/banners`);
    url.searchParams.set("website", envConfig.targetWebsite);
    url.searchParams.set("position", position);
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const body: unknown = await response.json();
    if (!isRecord(body) || !Array.isArray(body.banners)) return [];
    return body.banners.map(partnerFrom).filter((item): item is IPartnerBanner => item !== null).filter((item) => partnerIsLive(item));
  } catch {
    return [];
  }
});
