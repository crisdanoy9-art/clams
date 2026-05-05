// lib/hooks/useTableData.ts
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../api/Methods";

export const useTableData = (table: string, options?: Record<string, any>) => {
  return useQuery({
    queryKey: [table],
    queryFn: () => fetchData(table),
    ...options,
  });
};
