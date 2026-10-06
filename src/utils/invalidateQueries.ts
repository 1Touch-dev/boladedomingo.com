import { queryClient } from "@/config/queryClient";

export const invalidateQueries = async (queryKey: unknown[]) => {
  await queryClient.invalidateQueries({ queryKey });
};
