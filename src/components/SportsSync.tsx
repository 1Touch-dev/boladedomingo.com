"use client";

import { useArticlesQuery } from "@/hooks/useArticlesQuery";

export const SportsSync = () => {
  useArticlesQuery({ page: 1, limit: 40 });
  return null;
};
