import { queryKeyFactory } from "@/utils/query-key-factory";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createStudentInAccount,
  CreateStudentRequestBody,
  getAllStudentsFromInstitution,
  getAllStudentsFromOutlet,
} from "../requests/students";
import { outletKeys } from "./outlets-queries";

const studentsQueryKeys = queryKeyFactory("students");

function useGetAllStudentsOfOutlets(
  institutionId?: string,
  outletIds: string[] = [],
) {
  return useQueries({
    queries: outletIds.map((outletId) => ({
      queryKey: studentsQueryKeys.lists(),
      queryFn: async () => {
        if (!institutionId || !outletId) {
          return Promise.reject("no institutionId or outletId yet");
        }
        return getAllStudentsFromOutlet(institutionId, outletId);
      },
    })),
    combine: (results) => {
      return {
        data: results.map((res) => res.data),
        isPending: results.some((res) => res.isPending),
        refetch: () => {
          results.forEach((query) => query.refetch());
        },
      };
    },
  });
}

function useGetAllStudentsFromOutlet(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllStudentsFromOutlet(institutionId, outletId);
    },
    queryKey: [outletKeys.list, outletId, studentsQueryKeys.all],
  });
}

function useGetAllStudentsFromInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("no institutionId or outletId yet");
      }
      return getAllStudentsFromInstitution(institutionId);
    },
    queryKey: studentsQueryKeys.lists(),
  });
}

function useCreateStudentInStudentClientAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      params: CreateStudentRequestBody & {
        institution_id: string;
        account_id: string;
      },
    ) =>
      createStudentInAccount(params.institution_id, params.account_id, params),
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: studentsQueryKeys.lists() });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

export const StudentsApis = {
  useGetAllStudentsOfOutlets,
  useGetAllStudentsFromOutlet,
  useGetAllStudentsFromInstitution,
  useCreateStudentInStudentClientAccount,
};
