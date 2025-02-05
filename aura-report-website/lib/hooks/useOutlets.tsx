import { BaseOutlet } from "@/types/data/Outlet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOutletInInstitution,
  getAllOutletsInInstitution,
  getOutletById,
} from "../requests/outlet";

export function useGetAllOutletsById(institutionId: string, ids: string[]) {
  return useQuery({
    queryKey: ["outlets", ids],
    queryFn: () => {
      return Promise.all(ids.map((id) => getOutletById(institutionId, id)));
    },
  });
}

export function useGetAllOutletsInInstitution(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ["outlets"],
    queryFn: () => {
      return getAllOutletsInInstitution(id);
    },
    enabled,
  });
}
type CreateOutletMutationContext = {
  previousData: BaseOutlet[];
};
export function useCreateOutletInInstitution() {
  const queryClient = useQueryClient();
  return useMutation<
    BaseOutlet,
    Error,
    BaseOutlet & { institution_id: string },
    CreateOutletMutationContext
  >({
    mutationFn: createOutletInInstitution,
    onError: (error, variables) => {
      // An error happened!
      console.error(error);
      console.log(`rolling back optimistic update with id`);
    },
    // onMutate: (outlet) => {
    //   queryClient.cancelQueries({ queryKey: ["outlets"] });

    //   // take snapshot if old data
    //   const previousOutlets = queryClient.getQueryData([
    //     "institutions",
    //     outlet.institution_id,
    //     "outlets",
    //   ]) as BaseOutlet[];
    //   console.log(
    //     `taking snapshot of previous data ${JSON.stringify(previousOutlets)}`,
    //   );
    //   // optimistically add to list
    //   queryClient.setQueryData(
    //     ["institutions", outlet.institution_id, "outlets"],
    //     (oldOutlet: BaseOutlet) => {
    //       let optimisticOutlet: BaseOutlet = {
    //         id: nanoid(),
    //         name: outlet.name,
    //         address: "",
    //         postal_code: "",
    //         contact_number: "",
    //         description: "",
    //       };
    //       console.log(
    //         `optimistically updating new data ${JSON.stringify(oldOutlet)}`,
    //       );

    //       return optimisticOutlet;
    //     },
    //   );

    //   // pass snapshot of old data as context, we can use this context to rollback if error
    //   return { previousData: previousOutlets };
    // },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["outlets"],
      });
    },
    // onSettled: (data, error, variables, context) => {
    //   console.log("settled");
    // },
    // refetchInterval: 1*1000
  });
}

export function useGetAllOutletsOfInstitutions(
  ids: string[],
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["outlets"],
    queryFn: async () => {
      let allInstitutionOutlets = await Promise.all(
        ids.map(async (id) => {
          let outlets = await getAllOutletsInInstitution(id);
          return outlets.map((o) => ({ ...o, institution_id: id }));
        }),
      );
      return allInstitutionOutlets.flatMap((x) => x);
    },
    enabled,
  });
}
