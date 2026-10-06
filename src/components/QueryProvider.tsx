"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SportsSync } from "@/components/SportsSync";
import { createQueryClient } from "@/config/queryClient";

interface IQueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider = (props: IQueryProviderProps) => {
  const { children } = props;
  const [client] = useState(createQueryClient);

  return (
    <QueryClientProvider client={client}>
      <SportsSync />
      {children}
    </QueryClientProvider>
  );
};
