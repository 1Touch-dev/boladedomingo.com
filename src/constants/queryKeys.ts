import type { ISearchParams } from "@/types/api";

const queryKeys = {
  articles: ["articles"],
  standings: ["standings"],
  matches: ["matches"],
  articleBySlug: (slug: string) => ["article", slug],
  matchesByDate: (date: string) => ["matches", date],
  teamById: (id: string) => ["team", id],
  searchResults: (params: ISearchParams) => ["search", params],
};

export default queryKeys;
