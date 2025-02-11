import { queryKeyFactory } from "@/utils/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import {
  getAllExpandedLessonsOfInstitution,
  getAllExpandedLessonsOutlet,
} from "../requests/lesson";
import { institutionQueryKeys } from "./institutions-queries";
import { outletKeys } from "./outlets-queries";

export const lessonKeys = queryKeyFactory("lessons");

export function useGetAllLessonsOfInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("institution ID is undefined");
      }
      return getAllExpandedLessonsOfInstitution(institutionId);
    },
    queryKey: [institutionQueryKeys.all, institutionId, lessonKeys.lists()],
    enabled: !!institutionId,
  });
}

export function useGetAllLessonsOfOutlet(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("institution ID or outlet ID is undefined");
      }
      return getAllExpandedLessonsOutlet(institutionId, outletId);
    },
    queryKey: [
      institutionQueryKeys.all,
      institutionId,
      outletKeys.all,
      outletId,
      lessonKeys.lists(),
    ],
  });
}

export const LessonsApis = {
  useGetAllLessonsOfInstitution,
  useGetAllLessonsOfOutlet,
};
