import { BaseCourse } from "@/types/data/Course";
import { BaseEducator } from "@/types/data/Educator";
import { BaseLevel } from "@/types/data/Level";
import { BaseStudent } from "@/types/data/Student";
import { BaseSubject } from "@/types/data/Subject";
import { queryKeyFactory } from "@/utils/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLevelInInstitution,
  getAllExpandedLevelsOfInstitution,
  getAllLevelsOfInstitution,
} from "../requests/levels";

export type ExpandedLevel = BaseLevel & {
  courses: BaseCourse[];
  students: BaseStudent[];
  educators: BaseEducator[];
  subjects: BaseSubject[];
};

export const levelsQueryKeys = queryKeyFactory("levels");
function useCreateLevelOfInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLevelInInstitution,
    onError: (error, variables) => {
      console.log(`rolling back optimistic update with id`);
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: levelsQueryKeys.lists() });
    },
    onSettled: (data, error, variables, context) => {
      console.log("settled");
    },
    // refetchInterval: 1*1000
  });
}
function useGetAllLevelsOfInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("institution ID is undefined");
      }
      return getAllLevelsOfInstitution(institutionId);
    },
    queryKey: levelsQueryKeys.lists(),
    enabled: !!institutionId,
  });
}

// function useGetAllExpandedLevelsOfInstitution(
//   levels: BaseLevel[],
//   institutionId?: string,
//   outletId?: string,
// ) {
//   return useQueries({
//     queries: levels.map((lvl) => ({
//       queryFn: async () => {
//         console.log(
//           `running queries with ${institutionId}, ${outletId}, ${JSON.stringify(lvl.id)}`,
//         );
//         if (!institutionId || !outletId) {
//           return Promise.reject("institutionId or outletId is undefined");
//         }
//         return getExpandedLevel(institutionId, outletId, lvl);
//       },
//       queryKey: [levelsQueryKeys.detail(lvl.id)],
//     })),
//     combine: (results) => ({
//       data: results.map((res) => res.data),
//       isPending: results.some((res) => res.isPending),
//       isError: results.some((res) => res.isError),
//     }),
//   });
// }

function useGetAllExpandedLevelsOfInstitution(institutionId?: string) {
  return useQuery({
    queryFn: async () => {
      if (!institutionId) {
        return Promise.reject("institution ID is undefined");
      }
      return getAllExpandedLevelsOfInstitution(institutionId);
    },
    queryKey: levelsQueryKeys.lists(),
    enabled: !!institutionId,
  });
}

// async function getExpandedLevel(
//   institutionId: string,
//   outletId: string,
//   level: BaseLevel,
// ) {
//   const studentsPromise = getAllStudentsOfLevelInOutlet(
//     institutionId,
//     outletId,
//     level.id,
//   );
//   // get all educators of level
//   const educatorsPromise = getAllEducatorsOfLevelInOutlet(
//     institutionId,
//     outletId,
//     level.id,
//   );

//   // get all courses of level
//   const coursesPromise = getAllCoursesOfLevelInOutlet(
//     institutionId,
//     outletId,
//     level.id,
//   );

//   const subjectsPromise = getAllSubjectsOfLevelInInstitution(
//     institutionId,
//     level.id,
//   );

//   let [students, educators, courses, subjects] = await Promise.all([
//     studentsPromise,
//     educatorsPromise,
//     coursesPromise,
//     subjectsPromise,
//   ]);

//   return {
//     ...level,
//     students: students.data,
//     educators: educators.data,
//     courses: courses.data,
//     subjects: subjects.data,
//   };
// }

export const LevelsApis = {
  useCreateLevelOfInstitution,
  useGetAllLevelsOfInstitution,
  useGetAllExpandedLevelsOfInstitution,
};
