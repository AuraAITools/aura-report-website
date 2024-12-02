import { useQuery } from "@tanstack/react-query";
import { getAllInstitutions, getInstitutionById } from "../requests/institutions";

export function useGetAllInstitutions() {
    const {isPending, error, data } = useQuery({
        queryKey: ['institutions'],
        queryFn: () => getAllInstitutions(),
        // refetchInterval: 1*1000
    })
    return {isPending, error, data}
}

export function useGetInstitutionById(id: string) {
    const {isPending, error, data } = useQuery({
        queryKey: ['institutions', id],
        queryFn: () => getInstitutionById(id),
        // refetchInterval: 1 * 1000
    })
    return {isPending, error, data}
}