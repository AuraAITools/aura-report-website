import { z } from "zod";
import { BaseLevelSchema } from "./Level";
import { BaseOutletSchema } from "./Outlet";
import { BaseSubjectSchema } from "./Subject";

export const PRICE_FREQUENCIES = [
  "MONTHLY",
  "WEEKLY",
  "PER_LESSON",
  "TOTAL",
] as const;
export const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;
export type PriceFrequency = (typeof PRICE_FREQUENCIES)[number];
export type Days = (typeof DAYS)[number];
export const BaseLessonGenerationTemplateSchema = z.object({
  id: z.string().uuid(),
  start_time: z.string().time(),
  end_time: z.string().time(),
  day_of_week: z.enum(DAYS),
  week_number: z.number(),
});

export const BaseCourseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  max_size: z.number().min(1).max(10000),
  price: z.number().min(1).max(10000),
  price_frequency: z.enum(PRICE_FREQUENCIES),
  start_date: z.string(),
  end_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  lesson_number_frequency: z.number(),
  lesson_weekly_frequency: z.number(),
  lesson_generation_templates: BaseLessonGenerationTemplateSchema.array(),
});

export type BaseLessonGenerationTemplate = z.infer<
  typeof BaseLessonGenerationTemplateSchema
>;

export type BaseCourse = z.infer<typeof BaseCourseSchema>;
export const CourseSchemaWithAssociations = BaseCourseSchema.extend({
  outlet: BaseOutletSchema.optional(),
  level: BaseLevelSchema,
  subject: BaseSubjectSchema.optional(),
});
export type CourseWithAssociations = z.infer<
  typeof CourseSchemaWithAssociations
>;
