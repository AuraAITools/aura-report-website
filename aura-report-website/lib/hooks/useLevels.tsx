import { useQuery } from "@tanstack/react-query";
import { getAllLevels } from "../requests/levels";

export default function useGetAllLevels() {
  return useQuery({
    queryFn: getAllLevels,
    queryKey: ["levels"],
  });
}
