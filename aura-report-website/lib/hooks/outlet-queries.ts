import { queryKeyFactory } from "@/utils/query-key-factory";
import { useQueries } from "@tanstack/react-query";
import { getAllOutletsInInstitution } from "../requests/outlet";

const outletKeys = queryKeyFactory("outlets");
export const OutletApis = {
  getAllOutletsOfInstitutionIds: (institutionIds: string[]) => {
    return useQueries({
      queries: institutionIds.map((institutionId) => ({
        queryFn: async () => {
          const institutionOutlets =
            await getAllOutletsInInstitution(institutionId);
          return institutionOutlets.map((outlet) => ({
            ...outlet,
            institution_id: institutionId,
          }));
        },
        queryKey: ["institutions", institutionId, ...outletKeys.lists()],
      })),
      combine: (results) => ({
        data: results.flatMap((res) => res.data ?? []),
        isPending: results.some((res) => res.isPending),
        isError: results.some((res) => res.isError),
      }),
    });
  },
};
