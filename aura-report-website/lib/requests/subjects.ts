import { BaseSubject } from "@/types/data/Subject";
import { apiClient } from "../api-client";

export async function getAllSubjectsOfInstitution(institutionId: string) {
  let response = await apiClient.get<BaseSubject[]>(
    `/api/institutions/${institutionId}/subjects`,
  );
  console.log(`fetched subjects ${JSON.stringify(response.data)}`);
  return response.data;
}

export type CreateSubjectParams = {
  institution_id: string;
} & Omit<BaseSubject, "id">;
export async function createSubject(params: CreateSubjectParams) {
  const { institution_id, ...subjectBody } = params;
  console.log(`created subject ${JSON.stringify(params)}`);

  let response = await apiClient.post<BaseSubject>(
    `/api/institutions/${institution_id}/subjects`,
    JSON.stringify(subjectBody),
  );
  console.log(`created subject ${JSON.stringify(response.data)}`);
  return response.data;
}

export type DeleteSubjectParams = {
  institutionId: string;
  id: string;
};
export async function deleteSubject({
  institutionId,
  id,
}: DeleteSubjectParams) {
  let response = await apiClient.delete(
    `/api/institutions/${institutionId}/subjects/${id}`,
  );
  console.log(`deleted with status ${response.status}`);
  return response.data;
}
