import { BaseSubject } from "@/types/data/Subject";
import { apiClient } from "../api-client";

export async function getAllSubjectsOfInstitution(institutionId: string) {
  let response = await apiClient.get<BaseSubject[]>(
    `/api/institutions/${institutionId}/subjects`,
  );
  console.log(`fetched subjects ${JSON.stringify(response.data)}`);
  return response.data;
}

export async function createSubject(
  institutionId: string,
  subject: Omit<BaseSubject, "id">,
) {
  let response = await apiClient.post<BaseSubject>(
    `/api/institutions/${institutionId}/subjects`,
    JSON.stringify(subject),
  );
  console.log(`created subject ${JSON.stringify(response.data)}`);
  return response.data;
}

export async function deleteSubject(institutionId: string, id: string) {
  let response = await apiClient.delete(
    `/api/institutions/${institutionId}/subjects/${id}`,
  );
  console.log(`deleted with status ${response.status}`);
  return response.data;
}
