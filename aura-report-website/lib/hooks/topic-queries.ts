import { BaseTopic } from "@/types/data/Topic";
import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTopic,
  CreateTopicParams,
  deleteTopic,
  DeleteTopicParams,
  getAllExpandedTopicsOfInstitution,
} from "../requests/topics";
import { institutionQueryKeys } from "./institutions-queries";

const topicQueryKeys = queryKeyFactory("topics");
function useGetAllExpandedTopicsOfInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) return Promise.reject("institutionId is undefined");
      return getAllExpandedTopicsOfInstitution(institutionId);
    },
    queryKey: topicQueryKeys.institutionLists(institutionId),
  });
}

type CreateTopicMutationContext = {
  previousData: BaseTopic[];
};
export function useCreateTopicInInstitution() {
  const queryClient = useQueryClient();
  return useMutation<
    BaseTopic, // data returned on success
    Error, // error emitted
    CreateTopicParams, // variable passed in to the mutate function
    CreateTopicMutationContext // context to be passed
  >({
    mutationFn: createTopic,
    onSuccess: (data, variables, context) => {
      console.log(`succesfully created topic ${JSON.stringify(data)}`);
      queryClient.invalidateQueries({
        queryKey: topicQueryKeys.institutionLists(variables.institution_id),
      });
    },
    // onMutate: async (topic) => {
    //   queryClient.cancelQueries({ queryKey: ["topics"] });

    //   // take snapshot if old data
    //   const previousTopics = queryClient.getQueryData([
    //     "topics",
    //   ]) as BaseTopic[];
    //   console.log(
    //     `taking snapshot of previous data ${JSON.stringify(previousTopics)}`,
    //   );
    //   // optimistically add to list
    //   queryClient.setQueryData(["topics"], (oldTopics: BaseTopic[]) => {
    //     let optimisticTopicObject: BaseTopic = {
    //       id: nanoid(),
    //       name: topic.name,
    //     };
    //     let optimisticTopics = [...oldTopics, optimisticTopicObject];
    //     console.log(
    //       `optimistically updating new data ${JSON.stringify(oldTopics)}`,
    //     );
    //     return optimisticTopics;
    //   });

    //   // pass snapshot of old data as context, we can use this context to rollback if error
    //   return { previousData: previousTopics };
    // },
    onError: (err, variables, context) => {
      // conduct rollback
      console.log(`conducting rollback as request failed`);
      if (context) {
        console.log(
          `rolling back to previous context data ${JSON.stringify(context.previousData)}`,
        );
        queryClient.setQueryData(["topics"], context.previousData);
      }
      console.error(`create failed`, err);
    },
  });
}

// TODO: implement delete function
type DeleteTopicMutationContext = {
  previousData: BaseTopic[];
};
export function useDeleteTopicInInstitution() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    DeleteTopicParams,
    DeleteTopicMutationContext
  >({
    mutationFn: (deleteParams) => deleteTopic(deleteParams),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: institutionQueryKeys });
    },
    onMutate: async (params: DeleteTopicParams) => {
      await queryClient.cancelQueries({ queryKey: ["topics"] });

      // take snapshot of old data
      const previousTopics = queryClient.getQueryData([
        "topics",
      ]) as BaseTopic[];
      console.log(
        `taking snapshot of previous data ${JSON.stringify(previousTopics)}`,
      );
      // optimistically remove the user from list
      queryClient.setQueryData(["topics"], (oldTopics: BaseTopic[]) => {
        let optimisticData = oldTopics.filter(
          (topic) => topic.id !== params.id,
        );
        console.log(
          `optimistically updating new data ${JSON.stringify(optimisticData)}`,
        );
        return optimisticData;
      });

      // pass snapshot of old data as context, we can use this context to rollback if error
      return { previousData: previousTopics };
    },
    onError: (err, variables, context) => {
      // conduct rollback
      console.log(`conducting rollback as request failed`);
      if (context) {
        console.log(
          `rolling back to previous context data ${JSON.stringify(context.previousData)}`,
        );
        queryClient.setQueryData(["topics"], context.previousData);
      }
      console.error(`delete failed`, err);
    },
  });
}

export const TopicsApis = {
  useGetAllExpandedTopicsOfInstitution,
  useCreateTopicInInstitution,
  useDeleteTopicInInstitution,
};
