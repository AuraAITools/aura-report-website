import { BaseCourse } from "@/types/data/Course";
import { apiClient } from "../api-client";

export async function getAllCoursesFromOutlet(
  institutionId: string,
  outletId: string,
) {
  const coursesPromise = await apiClient.get<BaseCourse[]>(
    `/api/institutions/${institutionId}/outlets/${outletId}/courses`,
  );
  return coursesPromise.data;
}
