"use client";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "../requests/students";

export function useGetAllStudents() {
  const query = useQuery({
    queryKey: ["students"],
    queryFn: getAllStudents,
  });
  return query;
}
