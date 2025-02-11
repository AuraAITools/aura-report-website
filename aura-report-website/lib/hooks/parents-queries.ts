import { queryKeyFactory } from "@/utils/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { getAllParents } from "../requests/parents";
import { institutionQueryKeys } from "./institutions-queries";

const parentKeys = queryKeyFactory("parents");

export function useGetAllParents(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("institution ID is undefined");
      }
      return getAllParents(institutionId);
    },
    queryKey: [institutionQueryKeys.all, institutionId, parentKeys.lists()],
  });
}
