import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStudentInAccount,
  CreateStudentRequestBody,
  getAllStudentsFromInstitution,
  getAllStudentsFromOutlet,
  updateStudentInInstitution,
} from "../requests/students";

const studentsQueryKeys = queryKeyFactory("students");

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
    queryKey: studentsQueryKeys.outletLists(institutionId, outletId),
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
    queryKey: studentsQueryKeys.institutionLists(institutionId),
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
      queryClient.invalidateQueries({
        queryKey: studentsQueryKeys.institutionLists(variables.institution_id), // invalidate both institution and outlet caches for students
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

function useUpdateStudentInInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentInInstitution,
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
  useGetAllStudentsFromOutlet,
  useGetAllStudentsFromInstitution,
  useCreateStudentInStudentClientAccount,
  useUpdateStudentInInstitution,
};
