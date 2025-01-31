import { BaseAccount } from "@/types/data/Account";
import { AxiosRequestConfig } from "axios";
import { reportServiceApiClient } from "./report-service-api-client";

export async function createAccount(
  institutionId: string,
  account: Omit<BaseAccount, "id">,
  config?: AxiosRequestConfig,
) {
  return await reportServiceApiClient.post<void>(
    `/api/v1/institutions/${institutionId}/accounts`,
    account,
    config,
  );
}
