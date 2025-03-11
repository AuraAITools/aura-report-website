import { z } from "zod";
import { BaseCourseSchema } from "./Course";
import { BaseEducatorSchema } from "./Educator";
import { BaseStudentSchema } from "./Student";
export const LESSON_STATUS = [
  "COMPLETED",
  "CANCELLED",
  "POSTPONED",
  "MOST_RECENT_COMPLETED",
  "UPCOMING",
  "NEXT_UPCOMING",
  "REVIEWED",
  "NOT_REVIEWED",
  "PLANNED",
  "UNPLANNED",
] as const;

export const BaseLessonSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(LESSON_STATUS),
  date: z.string().date(),
  start_time: z.string().time(),
  end_time: z.string().time(),
  description: z.string().optional(),
});

export const ExpandedLessonSchema = BaseLessonSchema.extend({
  educators: BaseEducatorSchema.array(),
  students: BaseStudentSchema.array(),
  course: BaseCourseSchema,
});

export type ExpandedLesson = z.infer<typeof ExpandedLessonSchema>;
export type BaseLesson = z.infer<typeof BaseLessonSchema>;
