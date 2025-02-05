import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInstitutionAdminAccount,
  createOutletAdminAccount,
} from "../requests/accounts";

export function useCreateInstitutionAdminAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInstitutionAdminAccount,
    onError: (error, variables) => {
      // An error happened!
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

export function useCreateOutletAdminAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOutletAdminAccount,
    onError: (error, variables) => {
      // An error happened!
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
