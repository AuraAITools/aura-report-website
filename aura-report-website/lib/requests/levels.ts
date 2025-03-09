import { CreateLevelParams } from "@/features/levels-dashboard/create-levels-form/CreateLevelsForm";
import { BaseCourse } from "@/types/data/Course";
import { BaseEducator } from "@/types/data/Educator";
import { BaseLevel } from "@/types/data/Level";
import { BaseStudent } from "@/types/data/Student";
import { BaseSubject } from "@/types/data/Subject";
import { apiClient } from "../api-client";
export async function createLevelInInstitution(params: CreateLevelParams) {
  const { institution_id, ...requestBody } = params;
  return (
    await apiClient.post<BaseLevel[]>(
      `/api/institutions/${params.institution_id}/levels`,
      JSON.stringify(requestBody),
    )
  ).data;
}

export async function getAllLevelsOfInstitution(institutionId: string) {
  return (
    await apiClient.get<BaseLevel[]>(
      `/api/institutions/${institutionId}/levels`,
    )
  ).data;
}

export async function getAllStudentsOfLevelInOutlet(
  institutionId: string,
  outletId: string,
  levelId: string,
) {
  return await apiClient.get<BaseStudent>(
    `/api/institutions/${institutionId}/outlets/${outletId}/levels/${levelId}/students`,
  );
}

export async function getAllEducatorsOfLevelInOutlet(
  institutionId: string,
  outletId: string,
  levelId: string,
) {
  return await apiClient.get<BaseEducator>(
    `/api/institutions/${institutionId}/outlets/${outletId}/levels/${levelId}/educators`,
  );
}

export async function getAllCoursesOfLevelInOutlet(
  institutionId: string,
  outletId: string,
  levelId: string,
) {
  return await apiClient.get<BaseCourse>(
    `/api/institutions/${institutionId}/outlets/${outletId}/levels/${levelId}/courses`,
  );
}

export async function getAllSubjectsOfLevelInInstitution(
  institutionId: string,
  levelId: string,
) {
  return await apiClient.get<BaseSubject>(
    `/api/institutions/${institutionId}/levels/${levelId}/subjects`,
  );
}
