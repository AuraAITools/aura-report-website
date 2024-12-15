import { Student } from "@/types/data/Student";
import { apiClient } from "../api-client";

export async function getAllStudents(): Promise<Student[]> {
  const response = await apiClient.get<Student[]>("/api/students");
  console.log(`Students: ${JSON.stringify(response.data)}`);
  return response.data;
}

export async function getStudentById(id: string): Promise<Student> {
  const response = await apiClient.get<Student>(`/api/students/${id}`);
  return response.data;
}
