import {
  BaseEducator,
  BaseEducatorClientSchema,
  BaseEducatorSchema,
} from "@/types/data/Educator";
import { z } from "zod";
import { apiClient } from "../api-client";

export async function getAllEducatorClientsFromInstitution(
  institutionId: string,
) {
  return (
    await apiClient.get<BaseEducatorClientSchema[]>(
      `/api/institutions/${institutionId}/accounts/educator-clients`,
    )
  ).data;
}

export async function getAllEducatorsFromOutlet(
  institutionId: string,
  outletId: string,
) {
  return (
    await apiClient.get<BaseEducator[]>(
      `/api/institutions/${institutionId}/outlets/${outletId}/educators`,
    )
  ).data;
}

export type CreateEducatorAccountParams = Omit<
  BaseEducatorClientSchema,
  "educator" | "id"
> & { institution_id: string };
export async function createEducatorAccountInInstitution(
  params: CreateEducatorAccountParams,
) {
  const { institution_id, ...requestBody } = params;
  return await apiClient.post<BaseEducator>(
    `/api/institutions/${institution_id}/accounts/educator-clients`,
    JSON.stringify(requestBody),
  );
}

export const CreateEducatorParamsSchema = BaseEducatorSchema.omit({
  levels: true,
  subjects: true,
  outlets: true,
}).extend({
  level_ids: z.string().uuid().array(),
  subject_ids: z.string().uuid().array(),
  outlet_id: z.string().uuid(),
  institution_id: z.string().uuid(),
  educator_account_id: z.string().uuid(),
});

export type CreateEducatorParams = z.infer<typeof CreateEducatorParamsSchema>;

export async function createEducatorForAccountInOutlet(
  params: CreateEducatorParams,
) {
  const { outlet_id, institution_id, educator_account_id, ...requestBody } =
    params;
  return await apiClient.post<BaseEducator>(
    `/api/institutions/${institution_id}/outlets/${outlet_id}/accounts/${educator_account_id}/educators`,
    JSON.stringify(requestBody),
  );
}
