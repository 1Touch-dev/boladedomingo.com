import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/api";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: (failureCount, error) => {
          if (error instanceof ApiError) {
            if (error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429) {
              return false;
            }
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });

export const queryClient = createQueryClient();
