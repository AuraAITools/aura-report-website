import {
  BaseInstitution,
  BaseInstitutionSchema,
} from "@/types/data/Institution";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { reportServiceApiClient } from "./report-service-api-client";

export async function getInstitutionWithToken(
  access_token: string,
  config?: AxiosRequestConfig,
) {
  let res = await reportServiceApiClient
    .get<BaseInstitution[]>("/api/v1/institutions", {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${access_token}`,
      },
    })
    // TODO: throw a error response back
    .catch((e) => console.log(`error: ${JSON.stringify(e)}`));

  if (!res) {
    throw new Error(" something is wrong");
  }
  let institutions = res.data;
  console.log(`here: ${JSON.stringify(institutions)}`);

  // TODO: throw error response back
  z.array(BaseInstitutionSchema).parse(institutions);
  return institutions;
}
