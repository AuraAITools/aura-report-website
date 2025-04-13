import { BaseAccount, BaseAccountSchema } from "@/types/data/Account";
import { apiClient } from "../api-client";
import { z } from "zod";

export const ACCOUNT_RELATIONSHIP = ["PARENT", "SELF"] as const;

export const CreateInstitutionAdminParamsSchema = BaseAccountSchema.extend({
  institution_id: z.string().uuid(),
}).omit({
  pending_account_actions: true,
  personas: true,
});

export type CreateInstitutionAdminParams = z.infer<
  typeof CreateInstitutionAdminParamsSchema
>;

export async function createInstitutionAdminAccount(
  createInstitutionAdminParams: CreateInstitutionAdminParams,
): Promise<void> {
  const { institution_id, ...requestBody } = createInstitutionAdminParams;

  return await apiClient.post(
    `/api/institutions/${institution_id}/accounts/institution-admins`,
    requestBody,
  );
}

export const CreateOutletAdminParamsSchema = BaseAccountSchema.extend({
  institution_id: z.string().uuid(),
  outlet_id: z.string().uuid(),
}).omit({
  pending_account_actions: true,
  personas: true,
});

export type CreateOutletAdminParams = z.infer<
  typeof CreateOutletAdminParamsSchema
>;

export async function createOutletAdminAccount(
  createOutletAdminAccountParams: CreateOutletAdminParams,
): Promise<void> {
  const { institution_id, outlet_id, ...requestBody } =
    createOutletAdminAccountParams;
  return await apiClient.post(
    `/api/institutions/${institution_id}/outlets/${outlet_id}/accounts/outlet-admins`,
    requestBody,
  );
}

export async function getExpandedAccountsInInstitution(institution_id: string) {
  return (
    await apiClient.get<BaseAccount[]>(
      `/api/institutions/${institution_id}/accounts`,
    )
  ).data;
}
