import { z } from "zod";
import { BaseLevelSchema } from "./Level";
import { BaseOutletSchema } from "./Outlet";
import { BaseSubjectSchema } from "./Subject";

export const PRICE_FREQUENCIES = ["Month", "Week", "Lesson", "Total"] as const;
export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export const LESSON_FREQ_UNIT = ["None", "Day", "Week", "Month"] as const;
export type PriceFrequency = (typeof PRICE_FREQUENCIES)[number];
export type Days = (typeof DAYS)[number];
export type LessonFreqUnit = (typeof LESSON_FREQ_UNIT)[number];

export const BaseCourseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  size: z.number().min(1).max(10000),
  price: z.number().min(1).max(10000),
  price_frequency: z.enum(PRICE_FREQUENCIES),
  start_date: z.string(),
  end_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  // to generate lessons from classes
  lesson_freq: z.number(),
  lesson_freq_day: z.enum(DAYS),
  lesson_freq_unit: z.enum(LESSON_FREQ_UNIT),
});

export type BaseCourse = z.infer<typeof BaseCourseSchema>;
export const CourseSchemaWithAssociations = BaseCourseSchema.extend({
  outlet: BaseOutletSchema.optional(),
  level: BaseLevelSchema,
  subject: BaseSubjectSchema.optional(),
});
export type CourseWithAssociations = z.infer<
  typeof CourseSchemaWithAssociations
>;
