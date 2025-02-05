"use client";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { useQuery } from "@tanstack/react-query";
import { getAllStudentsFromOutlet } from "../requests/students";

export function useGetAllStudents() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const query = useQuery({
    queryKey: ["students"],
    queryFn: () =>
      getAllStudentsFromOutlet(currentInstitution?.id!, currentOutlet?.id!),
    enabled: status === "success",
  });
  return query;
}
