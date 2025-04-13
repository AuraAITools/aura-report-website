import { z } from "zod";
import { BaseCourseSchema } from "./Course";
import { BaseEducatorSchema } from "./Educator";
import { BaseStudentSchema } from "./Student";
export const LESSON_STATUS = [
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "POSTPONED",
] as const;
export type LessonStatus = (typeof LESSON_STATUS)[number];

export const LESSON_REVIEW_STATUS = ["REVIEWED", "NOT_REVIEWED"] as const;

export type LessonReviewStatus = (typeof LESSON_REVIEW_STATUS)[number];

export const LESSON_PLAN_STATUS = ["PLANNED", "NOT_PLANNED"] as const;

export type LessonPlanStatus = (typeof LESSON_PLAN_STATUS)[number];

export const BaseLessonSchema = z.object({
  id: z.string(),
  name: z.string(),
  lesson_status: z.enum(LESSON_STATUS),
  lesson_review_status: z.enum(LESSON_REVIEW_STATUS),
  lesson_plan_status: z.enum(LESSON_PLAN_STATUS),
  date: z.coerce.date(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  description: z.string().optional(),
});

export const ExpandedLessonSchema = BaseLessonSchema.extend({
  educators: BaseEducatorSchema.array(),
  students: BaseStudentSchema.array(),
  course: BaseCourseSchema,
});

export type ExpandedLesson = z.infer<typeof ExpandedLessonSchema>;
export type BaseLesson = z.infer<typeof BaseLessonSchema>;
