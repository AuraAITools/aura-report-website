import { BaseEducator, BaseEducatorClientSchema } from "@/types/data/Educator";
import { apiClient } from "../api-client";

export async function getAllEducatorClientsFromInstitution(
  institutionId: string,
) {
  return (
    await apiClient.get<BaseEducatorClientSchema[]>(
      `/api/institutions/${institutionId}/accounts/educator-clients`,
    )
  ).data;
}

export async function getAllEducatorsFromOutlet(
  institutionId: string,
  outletId: string,
) {
  return (
    await apiClient.get<BaseEducator[]>(
      `/api/institutions/${institutionId}/outlets/${outletId}/educators`,
    )
  ).data;
}
