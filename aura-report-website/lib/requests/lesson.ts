import { BaseLessonSchema, ExpandedLesson } from "@/types/data/Lesson";
import { z } from "zod";
import { apiClient } from "../api-client";

export type CreateLessonParams = z.infer<typeof CreateLessonParamsSchema>;

export const CreateLessonParamsSchema = z
  .object({
    institution_id: z.string().uuid(),
    outlet_id: z.string().uuid(),
    course_id: z.string().uuid(),
    educator_ids: z.string().uuid().array(),
    student_ids: z.string().uuid().array(),
  })
  .merge(BaseLessonSchema);

export async function createLessonInOutlet(params: CreateLessonParams) {
  const { institution_id, outlet_id, course_id, ...requestBody } = params;
  return await apiClient.post<CreateLessonParams>(
    `/api/institutions/${institution_id}/outlets/${outlet_id}/courses/${course_id}/lessons`,
    JSON.stringify(requestBody),
  );
}
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
