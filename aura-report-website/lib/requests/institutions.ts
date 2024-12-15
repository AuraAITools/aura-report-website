import { Institution } from "@/types/data/Institution";
import { apiClient } from "../api-client";

export async function getInstitutionById(id: string): Promise<Institution> {
  const response = await apiClient.get<Institution>(`/api/institutions/${id}`);
  return response.data;
}

/**
 * uses access token to get institution
 * @returns
 */
export async function getInstitutionsForSessionUser(): Promise<Institution[]> {
  const response = await apiClient.get<Institution[]>(`/api/institutions`);
  return response.data;
}
