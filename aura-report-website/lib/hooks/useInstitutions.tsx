import { useQuery } from "@tanstack/react-query";
import {
  getInstitutionById,
  getInstitutionsForSessionUser,
} from "../requests/institutions";

export function useGetInstitutionById(id: string) {
  const { isPending, error, data } = useQuery({
    queryKey: ["institutions", id],
    queryFn: () => getInstitutionById(id),
    // refetchInterval: 1 * 1000
  });
  return { isPending, error, data };
}

export function useGetInstitutionsForSessionUser() {
  return useQuery({
    queryKey: ["institutions"],
    queryFn: getInstitutionsForSessionUser,
  });
}
