import { BaseAccount } from "@/types/data/Account";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInstitutionAdminAccount,
  createOutletAdminAccount,
} from "../requests/accounts";
import { createStudentClientAccount } from "../requests/students";
function useCreateInstitutionAdminAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInstitutionAdminAccount,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["institution-admins"] });
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
      queryClient.invalidateQueries({ queryKey: ["outlet-admins"] });
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
    mutationFn: async (
      params: Omit<BaseAccount, "id"> & { institution_id: string },
    ) => createStudentClientAccount(params.institution_id, params),
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["student-clients"] });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}

export const AccountsApis = {
  useCreateInstitutionAdminAccount,
  useCreateOutletAdminAccount,
  useCreateStudentClientAccount,
};
