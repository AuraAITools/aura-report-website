import { BaseStudent } from "@/types/data/Student";
import { apiClient } from "../api-client";

export async function getAllStudentsFromOutlet(
  institutionId: string,
  outletId: string,
) {
  const studentsPromise = await apiClient.get<BaseStudent[]>(
    `/api/institutions/${institutionId}/outlets/${outletId}/students`,
  );

  return studentsPromise.data;
}
