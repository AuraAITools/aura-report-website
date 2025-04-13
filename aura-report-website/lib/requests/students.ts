import { BaseAccountSchema } from "@/types/data/Account";
import { BaseCourse } from "@/types/data/Course";
import { BaseLevel } from "@/types/data/Level";
import { BaseOutlet } from "@/types/data/Outlet";
import {
  BaseStudent,
  BaseStudentSchema,
  StudentWithAssociations,
} from "@/types/data/Student";
import { z } from "zod";
import { apiClient } from "../api-client";

export async function getAllStudentsFromOutlet(
  institutionId: string,
  outletId: string,
) {
  const studentsPromise = await apiClient.get<BaseStudent[]>(
    `/api/institutions/${institutionId}/outlets/${outletId}/students`,
  );

  return studentsPromise.data;
}

export async function getAllStudentsFromInstitution(institutionId: string) {
  const studentsPromise = await apiClient.get<StudentWithAssociations[]>(
    `/api/institutions/${institutionId}/students`,
  );

  return studentsPromise.data;
}

export const CreateStudentClientAccountParamsSchema = BaseAccountSchema.omit({
  id: true,
  pending_account_actions: true,
  personas: true,
}).extend({
  institution_id: z.string().uuid(),
});

export type CreateStudentClientAccountParams = z.infer<
  typeof CreateStudentClientAccountParamsSchema
>;

export async function createStudentClientAccount(
  createStudentClientAccountParams: CreateStudentClientAccountParams,
) {
  const { institution_id, ...requestBody } = createStudentClientAccountParams;
  let response = await apiClient.post<BaseStudent>(
    `/api/institutions/${institution_id}/accounts/student-clients`,
    JSON.stringify(requestBody),
  );
  console.log(
    `created student_client_account ${JSON.stringify(response.data)}`,
  );
  return response.data;
}

export const CreateStudentRequestBodySchema = BaseStudentSchema.omit({
  relationship: true,
  id: true,
  contact: true,
}).extend({
  level_id: z.string().uuid(),
  course_ids: z.string().uuid().array(),
});

export type CreateStudentRequestBody = z.infer<
  typeof CreateStudentRequestBodySchema
>;

export async function createStudentInAccount(
  institution_id: string,
  account_id: string,
  student: CreateStudentRequestBody,
) {
  let response = await apiClient.post<
    BaseStudent & {
      current_level: string;
      level: BaseLevel;
      outlets: BaseOutlet[];
      courses: BaseCourse[];
    }
  >(
    `/api/institutions/${institution_id}/accounts/${account_id}/students`,
    JSON.stringify(student),
  );
  console.log(
    `created student_client_account ${JSON.stringify(response.data)}`,
  );
  return response.data;
}

export const UpdateStudentParamsSchema = z.object({
  institution_id: z.string().uuid(),
  student_id: z.string().uuid(),
  name: z.string().optional(),
  date_of_birth: z.coerce.date().optional(),
  current_school: z.string().optional(),
  level_id: z.string().uuid(),
  outlet_ids: z.string().uuid().array(),
  course_ids: z.string().uuid().array(),
});

export type UpdateStudentParams = z.infer<typeof UpdateStudentParamsSchema>;

export async function updateStudentInInstitution(params: UpdateStudentParams) {
  const { institution_id, student_id, ...requestBody } = params;
  console.log("here:" + JSON.stringify(requestBody));
  return await apiClient.patch<StudentWithAssociations>(
    `/api/institutions/${institution_id}/students/${student_id}`,
    JSON.stringify(requestBody),
  );
}
