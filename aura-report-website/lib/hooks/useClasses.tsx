import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "../requests/courses";

export default function useClasses() {
  return useQuery({
    queryFn: getAllCourses,
    queryKey: ["courses"],
  });
}
