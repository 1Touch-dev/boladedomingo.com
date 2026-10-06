import { envConfig } from "@/config/env";
import httpService from "@/services/httpService";
import type { IApiSuccessResponse } from "@/types/api";
import type { IArticleListParams, ICmsArticle } from "./articles.type";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const asArticle = (value: unknown): ICmsArticle | null => {
  if (!isRecord(value)) return null;
  if (typeof value.slug !== "string" && typeof value.title !== "string") return null;
  return value as unknown as ICmsArticle;
};

const unwrapList = (body: unknown): ICmsArticle[] => {
  if (Array.isArray(body)) return body.map(asArticle).filter((row): row is ICmsArticle => row !== null);
  if (!isRecord(body) || !Array.isArray(body.data)) return [];
  return body.data.map(asArticle).filter((row): row is ICmsArticle => row !== null);
};

const unwrapOne = (body: unknown): ICmsArticle | null => {
  const direct = asArticle(body);
  if (direct) return direct;
  if (!isRecord(body)) return null;
  return asArticle(body.data);
};

const articlesApis = {
  getAll: async (params?: IArticleListParams): Promise<IApiSuccessResponse<ICmsArticle[]>> => {
    const body: unknown = await httpService.get<ICmsArticle[]>("/ai-articles", {
      params: {
        targetWebsite: envConfig.targetWebsite,
        page: params?.page ?? 1,
        limit: params?.limit ?? 40,
        sort: "createdAt",
        order: "desc",
        ...(params?.category ? { category: params.category } : {}),
      },
    });

    return { success: true, message: "ok", data: unwrapList(body) };
  },

  getById: async (slug: string): Promise<IApiSuccessResponse<ICmsArticle>> => {
    const body: unknown = await httpService.get<ICmsArticle>(`/ai-articles/slug/${encodeURIComponent(slug)}`, {
      params: { targetWebsite: envConfig.targetWebsite },
    });
    const article = unwrapOne(body);
    return { success: true, message: "ok", data: article ?? undefined };
  },
};

export default articlesApis;
