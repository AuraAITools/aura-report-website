import { useQuery } from "@tanstack/react-query";
import { getAllCoursesFromOutlet } from "../requests/courses";

export default function useClasses(institutionId: string, outletId: string) {
  console.log(`${institutionId}, ${outletId}`);
  return useQuery({
    queryFn: () => getAllCoursesFromOutlet(institutionId, outletId),
    queryKey: ["courses"],
  });
}
