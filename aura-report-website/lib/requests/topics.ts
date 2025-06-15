import { BaseTopicSchema, ExpandedTopic } from "@/types/data/Topic";
import { apiClient } from "../api-client";
import { z } from "zod";
export async function getAllExpandedTopicsOfInstitution(institutionId: string) {
  let response = await apiClient.get<ExpandedTopic[]>(
    `/api/institutions/${institutionId}/topics/expand`,
  );
  console.log(`fetched topics ${JSON.stringify(response.data)}`);
  return response.data;
}

export const CreateTopicParamsSchema = BaseTopicSchema.omit({
  id: true,
}).extend({
  institution_id: z.string().uuid(),
  subject_ids: z.array(z.string().uuid()).optional(),
});

export type CreateTopicParams = z.infer<typeof CreateTopicParamsSchema>;

export async function createTopic(params: CreateTopicParams) {
  const { institution_id, ...requestBody } = params;
  console.log(`created topic ${JSON.stringify(params)}`);

  let response = await apiClient.post<ExpandedTopic>(
    `/api/institutions/${institution_id}/topics`,
    JSON.stringify(requestBody),
  );
  console.log(`created topic ${JSON.stringify(response.data)}`);
  return response.data;
}

export type DeleteTopicParams = {
  institutionId: string;
  id: string;
};
export async function deleteTopic({ institutionId, id }: DeleteTopicParams) {
  let response = await apiClient.delete(
    `/api/institutions/${institutionId}/topics/${id}`,
  );
  console.log(`deleted with status ${response.status}`);
  return response.data;
}
