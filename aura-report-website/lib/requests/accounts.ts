import { BaseAccount } from "@/types/data/Account";
import { apiClient } from "../api-client";

export async function createAccount(
  account: Partial<BaseAccount> & { institution_id: string },
): Promise<void> {
  let body = JSON.stringify({
    email: account.email,
    first_name: account.first_name,
    last_name: account.last_name,
    contact: account.contact,
    relationship: account.relationship,
  });
  console.log(`sending request with body ${body}`);
  return await apiClient.post(
    `/api/institutions/${account.institution_id}/accounts`,
    body,
  );
}
