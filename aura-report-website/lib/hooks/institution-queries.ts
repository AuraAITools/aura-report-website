import { BaseInstitution } from "@/types/data/Institution";
import { queryKeyFactory } from "@/utils/query-key-factory";
import { useQueries } from "@tanstack/react-query";
import { getInstitutionById } from "../requests/institutions";

const institutionQueryKeys = queryKeyFactory("institutions");

export const InstitutionApi = {
  // GetInstitutionById: useQuery(),
  getInstitutionByIds: (institutionIds: string[]) => {
    return useQueries({
      queries: institutionIds.map((institutionId) => ({
        queryFn: () => getInstitutionById(institutionId),
        queryKey: institutionQueryKeys.detail(institutionId), // creates a [institutions, detail, id] cache
      })),
      combine: (results) => ({
        data: results.map((res) => res.data) as BaseInstitution[],
        isPending: results.some((res) => res.isPending),
        isError: results.some((res) => res.isError),
        refetch: () => {
          results.forEach((res) => res.refetch());
        },
      }),
    });
  },
};

// const {
//   data: institutions,
//   isError,
//   isPending: fetchInstitutionIsPending,
//   refetch: refetchInstitutions,
// } = useQueries({
//   queries: session.user.ext_attrs.tenant_ids.map((institutionId) => ({
//     queryFn: () => getInstitutionById(institutionId),
//     queryKey: ["institutions", institutionId],
//   })),
//   combine: (results) => ({
//     data: results.map((res) => res.data) as BaseInstitution[],
//     isPending: results.some((res) => res.isPending),
//     isError: results.some((res) => res.isError),
//     refetch: () => {
//       results.forEach((res) => res.refetch());
//     },
//   }),
// });
