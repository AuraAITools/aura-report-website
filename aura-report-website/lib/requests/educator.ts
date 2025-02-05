import { BaseEducator } from "@/types/data/Educator";
import { apiClient } from "../api-client";

export async function getAllEducatorsFromOutlet(
  institutionId: string,
  outletId: string,
) {
  const educatorsPromise = await apiClient.get<BaseEducator[]>(
    `/api/institutions/${institutionId}/outlets/${outletId}/educators`,
  );

  return educatorsPromise.data;
}
