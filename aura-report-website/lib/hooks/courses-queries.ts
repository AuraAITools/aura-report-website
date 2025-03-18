import { BaseCourse } from "@/types/data/Course";
import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCourseInOutlet,
  CreateCourseParams,
  getAllCoursesFromOutlet,
  getAllExpandedCoursesFromOutlet,
} from "../requests/courses";

export const courseKeys = queryKeyFactory("courses");

function useGetAllCoursesFromOutlet(institutionId?: string, outletId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("no institution id or outlet id yet");
      }
      return getAllCoursesFromOutlet(institutionId, outletId);
    },
    queryKey: courseKeys.lists(),
  });
}

function useGetAllExpandedCoursesFromOutlet(
  institutionId?: string,
  outletId?: string,
) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId || !outletId) {
        return Promise.reject("no institution id or outlet id yet");
      }
      return getAllExpandedCoursesFromOutlet(institutionId, outletId);
    },
    queryKey: courseKeys.lists(),
  });
}

// TODO: fix the schema of BaseCourses to match the DTOs of backend
type CreateCourseMutationContext = {
  previousData: BaseCourse[];
};
export function useCreateCourseInOutlet() {
  const queryClient = useQueryClient();
  return useMutation<
    BaseCourse, // data returned on success
    Error, // error emitted
    CreateCourseParams, // variable passed in to the mutate function
    CreateCourseMutationContext // context to be passed
  >({
    mutationFn: async (course: CreateCourseParams) =>
      createCourseInOutlet(course),
    onSuccess: (data, variables, context) => {
      console.log(`succesfully created course ${JSON.stringify(data)}`);
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    // onMutate: async (course) => {
    //   queryClient.cancelQueries({ queryKey: ["courses"] });

    //   // take snapshot if old data
    //   const previousCourses = queryClient.getQueryData([
    //     "courses",
    //   ]) as BaseCourse[];
    //   console.log(
    //     `taking snapshot of previous data ${JSON.stringify(previousCourses)}`,
    //   );
    //   // optimistically add to list
    //   queryClient.setQueryData(["courses"], (oldCourses: BaseCourse[]) => {
    //     let optimisticCourseObject: BaseCourse = {
    //       id: nanoid(),
    //       ...course,
    //     };
    //     let optimisticCourses = [...oldCourses, optimisticCourseObject];
    //     console.log(
    //       `optimistically updating new data ${JSON.stringify(oldCourses)}`,
    //     );
    //     return optimisticCourses;
    //   });

    //   // pass snapshot of old data as context, we can use this context to rollback if error
    //   return { previousData: previousCourses };
    // },
    onError: (err, variables, context) => {
      // conduct rollback
      console.log(`conducting rollback as request failed`);
      if (context) {
        console.log(
          `rolling back to previous context data ${JSON.stringify(context.previousData)}`,
        );
        queryClient.setQueryData(["courses"], context.previousData);
      }
      console.error(`create failed`, err);
    },
  });
}

export const CoursesApis = {
  useGetAllCoursesFromOutlet,
  useGetAllExpandedCoursesFromOutlet,
  useCreateCourseInOutlet,
};
