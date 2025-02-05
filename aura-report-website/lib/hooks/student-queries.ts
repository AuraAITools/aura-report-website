import { queryKeyFactory } from "@/utils/query-key-factory";
import { useQueries } from "@tanstack/react-query";
import { getAllStudentsFromOutlet } from "../requests/students";

const studentQueryKeys = queryKeyFactory("students");

export const StudentApis = {
  getAllStudentOfOutlets(institutionId: string, outletIds: string[]) {
    return useQueries({
      queries: outletIds.map((outletId) => ({
        queryKey: studentQueryKeys.lists(),
        queryFn: () => getAllStudentsFromOutlet(institutionId, outletId), // this id will definitely not be falsy due to the enabled check
      })),
      combine: (results) => {
        return {
          data: results.map((res) => res.data),
          isPending: results.some((res) => res.isPending),
          refetch: () => {
            results.forEach((query) => query.refetch());
          },
        };
      },
    });
  },
};
