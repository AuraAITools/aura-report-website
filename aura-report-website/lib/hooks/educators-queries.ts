import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEducatorAccountInInstitution,
  createEducatorForAccountInOutlet,
  getAllEducatorClientsFromInstitution,
  getAllEducatorsFromOutlet,
} from "../requests/educator";

export const educatorKeys = queryKeyFactory("educators");

function useGetAllEducatorClientsFromInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllEducatorClientsFromInstitution(institutionId);
    },
    queryKey: educatorKeys.institutionLists(institutionId),
  });
}

function useGetAllEducatorsFromInstitution(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllEducatorsFromOutlet(institutionId, outletId);
    },
    queryKey: educatorKeys.institutionLists(institutionId),
  });
}

function useCreateEducatorAccountInInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEducatorAccountInInstitution,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: educatorKeys.institutionLists(variables.institution_id),
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
  });
}

/**
 * TODO: make the query outlet scoped
 * @returns
 */
function useCreateEducatorForAccountInOutlet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEducatorForAccountInOutlet,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: educatorKeys.institutionLists(variables.institution_id),
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
  });
}

export const EducatorsApis = {
  useGetAllEducatorsFromInstitution,
  useGetAllEducatorClientsFromInstitution,
  useCreateEducatorAccountInInstitution,
  useCreateEducatorForAccountInOutlet,
};
