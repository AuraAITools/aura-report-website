import { BaseSubject } from "@/types/data/Subject";
import { apiClient } from "../api-client";

export async function getAllSubjects() {
  let response = await apiClient.get<BaseSubject[]>("/api/subjects");
  console.log(`fetched subjects ${JSON.stringify(response.data)}`);
  return response.data;
}

export async function createSubject(subject: Omit<BaseSubject, "id">) {
  let response = await apiClient.post<BaseSubject>(
    "/api/subjects",
    JSON.stringify(subject),
  );
  console.log(`created subject ${JSON.stringify(response.data)}`);
  return response.data;
}

export async function deleteSubject(id: string) {
  let response = await apiClient.delete(`/api/subjects/${id}`);
  console.log(`deleted with status ${response.status}`);
  return response.data;
}
