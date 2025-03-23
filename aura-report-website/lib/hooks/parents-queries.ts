import { queryKeyFactory } from "@/utils/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { getAllParents } from "../requests/parents";

export const parentKeys = queryKeyFactory("parents");

export function useGetAllParents(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("institution ID is undefined");
      }
      return getAllParents(institutionId);
    },
    queryKey: parentKeys.institutionLists(institutionId),
  });
}
