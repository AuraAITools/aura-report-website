import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccount } from "../requests/accounts";

export default function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    onError: (error, variables) => {
      // An error happened!
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}
