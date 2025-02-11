import { BaseParentClientAccount } from "@/types/data/Parents";
import { apiClient } from "../api-client";

export async function getAllParents(institutionId: string) {
  const response = await apiClient.get<BaseParentClientAccount[]>(
    `/api/institutions/${institutionId}/accounts/student-clients`,
  );
  return response.data;
}
