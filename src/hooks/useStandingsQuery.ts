"use client";

import { useQuery } from "@tanstack/react-query";
import standingsApis from "@/apis/standings/standingsApis";
import queryKeys from "@/constants/queryKeys";
import { useIsClient } from "@/hooks/useIsClient";

export const useStandingsQuery = () => {
  const isClient = useIsClient();

  return useQuery({
    queryKey: queryKeys.standings,
    queryFn: () => standingsApis.getAll(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
    select: (res) => res.data,
    enabled: isClient,
  });
};
