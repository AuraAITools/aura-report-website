import { useQuery } from "@tanstack/react-query";
import { getInstitutionById } from "../requests/institutions";

export function useGetInstitutionById(id: string) {
  return useQuery({
    queryKey: ["institutions", id],
    queryFn: () => {
      if (!id) throw new Error("No institution id available");
      return getInstitutionById(id);
    },
  });
}

export function useGetInstitutionsByIds(ids: string[], enabled: boolean) {
  return useQuery({
    // TODO: investigate if this is the correct way to cache multiple keys
    queryKey: ["institutions", ids],
    queryFn: () => {
      return Promise.all(ids.map((id) => getInstitutionById(id)));
    },
    enabled,
  });
}
