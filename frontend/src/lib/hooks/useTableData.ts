import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../api/Methods";

export const useTableData = (table: string) => {
  return useQuery({
    queryKey: [table],
    queryFn: () => fetchData(table),
  });
};
