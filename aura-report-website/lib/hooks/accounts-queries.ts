import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlankAccount,
  createInstitutionAdminAccount,
  createOutletAdminAccount,
  createStudentClientAccount,
  getExpandedAccountsInInstitution,
} from "../requests/accounts";

export const accountQueryKeys = queryKeyFactory("accounts");

function useCreateInstitutionAdminAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInstitutionAdminAccount,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

function useCreateOutletAdminAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOutletAdminAccount,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

function useCreateStudentClientAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudentClientAccount,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: accountQueryKeys.institutionLists(variables.institution_id),
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

function useCreateBlankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlankAccount,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: accountQueryKeys.institutionLists(variables.institution_id),
      });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

function useGetAllExpandedAccountsInInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("no institution id or outlet id yet");
      }
      return getExpandedAccountsInInstitution(institutionId);
    },
    queryKey: accountQueryKeys.lists(),
  });
}

export const AccountsApis = {
  useCreateBlankAccount,
  useCreateInstitutionAdminAccount,
  useCreateOutletAdminAccount,
  useCreateStudentClientAccount,
  useGetAllExpandedAccountsInInstitution,
};
