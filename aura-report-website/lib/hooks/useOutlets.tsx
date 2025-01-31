import { useQuery } from "@tanstack/react-query";
import { getAllOutletsInInstitution, getOutletById } from "../requests/outlet";

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
