import { ExpandedLesson } from "@/types/data/Lesson";
import { apiClient } from "../api-client";

export async function getAllExpandedLessonsOfInstitution(
  institutionId: string,
) {
  return (
    await apiClient.get<ExpandedLesson[]>(
      `/api/institutions/${institutionId}/lessons/expand`,
    )
  ).data;
}

export async function getAllExpandedLessonsOutlet(
  institutionId: string,
  outletId: string,
) {
  return (
    await apiClient.get<ExpandedLesson[]>(
      `/api/institutions/${institutionId}/outlets/${outletId}/lessons/expand`,
    )
  ).data;
}
