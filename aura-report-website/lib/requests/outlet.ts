import { BaseOutlet } from "@/types/data/Outlet";
import { apiClient } from "../api-client";

export async function getOutletById(
  institutionId: string,
  outletId: string,
): Promise<BaseOutlet> {
  const response = await apiClient.get<BaseOutlet>(
    `/api/institutions/${institutionId}/outlets/${outletId}`,
  );
  return response.data;
}

export async function getAllOutletsInInstitution(
  id: string,
): Promise<BaseOutlet[]> {
  const response = await apiClient.get<BaseOutlet[]>(
    `/api/institutions/${id}/outlets`,
  );
  return response.data;
}

export async function createOutletInInstitution(
  outlet: BaseOutlet & { institution_id: string },
): Promise<BaseOutlet> {
  const { institution_id, ...outletBody } = outlet;
  const response = await apiClient.post<BaseOutlet>(
    `/api/institutions/${outlet.institution_id}/outlets`,
    JSON.stringify(outletBody),
  );
  return response.data;
}
