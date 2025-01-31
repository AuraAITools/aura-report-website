import { StudentWithAssociations } from "@/types/data/Student";
import { apiClient } from "../api-client";

export async function getAllStudents(): Promise<StudentWithAssociations[]> {
  const response =
    await apiClient.get<StudentWithAssociations[]>("/api/students");
  console.log(`Students: ${JSON.stringify(response.data)}`);
  return response.data;
}

export async function getStudentById(
  id: string,
): Promise<StudentWithAssociations> {
  const response = await apiClient.get<StudentWithAssociations>(
    `/api/students/${id}`,
  );
  return response.data;
}
