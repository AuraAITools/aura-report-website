import { BaseInstitution } from "@/types/data/Institution";
import { apiClient } from "../api-client";

export async function getInstitutionById(id: string): Promise<BaseInstitution> {
  const response = await apiClient.get<BaseInstitution>(
    `/api/institutions/${id}`,
  );
  return response.data;
}

/**
 * uses access token to get institution
 * @returns
 */
export async function getInstitutionsForSessionUser(): Promise<
  BaseInstitution[]
> {
  const response = await apiClient.get<BaseInstitution[]>(`/api/institutions`);
  return response.data;
}
