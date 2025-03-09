import { BaseCourse, BaseCourseSchema } from "@/types/data/Course";
import { z } from "zod";
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

export const CreateCourseRequestSchema = BaseCourseSchema.extend({
  subject_ids: z.string().uuid().array(),
  level_id: z.string().uuid(),
}).omit({
  id: true,
});

export type CreateCourseRequest = z.infer<typeof CreateCourseRequestSchema>;

export type CreateCourseParams = CreateCourseRequest & {
  institution_id: string;
  outlet_id: string;
};
export async function createCourseInOutlet(params: CreateCourseParams) {
  let { institution_id, outlet_id, ...createCourseRequestBody } = params;
  let response = await apiClient.post<BaseCourse>(
    `/api/institutions/${institution_id}/outlets/${outlet_id}/courses`,
    JSON.stringify(createCourseRequestBody),
  );
  console.log(`created course ${JSON.stringify(response.data)}`);
  return response.data;
}
