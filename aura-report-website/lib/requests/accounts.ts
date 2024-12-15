import { Account } from "@/types/data/Account";
import { apiClient } from "../api-client";

export async function createAccount(account: Partial<Account>): Promise<void> {
  const response = await apiClient.post(
    "/api/accounts",
    JSON.stringify(account),
  );
}
