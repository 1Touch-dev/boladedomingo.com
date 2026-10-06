"use client";

import { useQuery } from "@tanstack/react-query";
import matchesApis from "@/apis/matches/matchesApis";
import queryKeys from "@/constants/queryKeys";
import { useIsClient } from "@/hooks/useIsClient";

export const useMatchesQuery = () => {
  const isClient = useIsClient();

  return useQuery({
    queryKey: queryKeys.matches,
    queryFn: () => matchesApis.getAll(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
    select: (res) => res.data,
    enabled: isClient,
  });
};

export const useMatchesByDateQuery = (date: string) => {
  const isClient = useIsClient();

  return useQuery({
    queryKey: queryKeys.matchesByDate(date),
    queryFn: () => matchesApis.getByDate(date),
    staleTime: 1000 * 30,
    select: (res) => res.data,
    enabled: isClient && Boolean(date),
  });
};
