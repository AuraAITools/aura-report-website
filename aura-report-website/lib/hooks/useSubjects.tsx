import { Subject } from "@/types/data/Subject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
} from "../requests/subjects";

type CreateSubjectMutationContext = {
  previousData: Subject[];
};
export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation<
    Subject, // data returned on success
    Error, // error emitted
    Omit<Subject, "id">, // variable passed in to the mutate function
    CreateSubjectMutationContext // context to be passed
  >({
    mutationFn: createSubject,
    onSuccess: (data, variables, context) => {
      console.log(`succesfully created subject ${JSON.stringify(data)}`);
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onMutate: async (subject) => {
      queryClient.cancelQueries({ queryKey: ["subjects"] });

      // take snapshot if old data
      const previousSubjects = queryClient.getQueryData([
        "subjects",
      ]) as Subject[];
      console.log(
        `taking snapshot of previous data ${JSON.stringify(previousSubjects)}`,
      );
      // optimistically remove the user from list
      queryClient.setQueryData(["subjects"], (oldSubjects: Subject[]) => {
        let optimisticSubjectObject: Subject = {
          id: nanoid(),
          name: subject.name,
        };
        let optimisticSubjects = [...oldSubjects, optimisticSubjectObject];
        console.log(
          `optimistically updating new data ${JSON.stringify(oldSubjects)}`,
        );
        return optimisticSubjects;
      });

      // pass snapshot of old data as context, we can use this context to rollback if error
      return { previousData: previousSubjects };
    },
    onError: (err, variables, context) => {
      // conduct rollback
      console.log(`conducting rollback as request failed`);
      if (context) {
        console.log(
          `rolling back to previous context data ${JSON.stringify(context.previousData)}`,
        );
        queryClient.setQueryData(["subjects"], context.previousData);
      }
      console.error(`create failed`, err);
    },
  });
}

export function useGetAllSubjects() {
  return useQuery({
    queryFn: getAllSubjects,
    queryKey: ["subjects"],
  });
}

type DeleteSubjectMutationContext = {
  previousData: Subject[];
};
export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string, DeleteSubjectMutationContext>({
    mutationFn: deleteSubject,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ["subjects"] });

      // take snapshot of old data
      const previousSubjects = queryClient.getQueryData([
        "subjects",
      ]) as Subject[];
      console.log(
        `taking snapshot of previous data ${JSON.stringify(previousSubjects)}`,
      );
      // optimistically remove the user from list
      queryClient.setQueryData(["subjects"], (oldSubjects: Subject[]) => {
        let optimisticData = oldSubjects.filter(
          (subject) => subject.id !== deletedId,
        );
        console.log(
          `optimistically updating new data ${JSON.stringify(optimisticData)}`,
        );
        return optimisticData;
      });

      // pass snapshot of old data as context, we can use this context to rollback if error
      return { previousData: previousSubjects };
    },
    onError: (err, variables, context) => {
      // conduct rollback
      console.log(`conducting rollback as request failed`);
      if (context) {
        console.log(
          `rolling back to previous context data ${JSON.stringify(context.previousData)}`,
        );
        queryClient.setQueryData(["subjects"], context.previousData);
      }
      console.error(`delete failed`, err);
    },
  });
}
