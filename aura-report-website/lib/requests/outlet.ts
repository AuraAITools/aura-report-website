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
