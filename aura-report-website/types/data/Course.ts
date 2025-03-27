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
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  day_of_week: z.enum(DAYS),
  week_number: z.number(),
});

export const BaseCourseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  max_size: z.coerce.number().min(1).max(10000),
  price: z.coerce.number().min(0).max(10000),
  price_frequency: z.enum(PRICE_FREQUENCIES),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  lesson_number_frequency: z.coerce.number().min(1).max(20),
  lesson_weekly_frequency: z.coerce.number().min(1).max(20),
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
