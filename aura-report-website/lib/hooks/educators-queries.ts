import { queryKeyFactory } from "@/utils/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { getAllEducatorClientsFromInstitution } from "../requests/educator";
import { institutionQueryKeys } from "./institutions-queries";

export const educatorKeys = queryKeyFactory("educators");

function useGetAllEducatorClientsFromInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllEducatorClientsFromInstitution(institutionId);
    },
    queryKey: [institutionQueryKeys.all, institutionId, educatorKeys.all],
  });
}

export const EducatorsApis = {
  useGetAllEducatorClientsFromInstitution,
};
