import { z } from "zod";
import { BaseAccountSchema } from "./Account";
import { BaseCourseSchema } from "./Course";
import { BaseLevelSchema } from "./Level";
import { BaseOutletSchema } from "./Outlet";

export const BaseStudentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  dateOfBirth: z.coerce.date(), // handle string dates
  currentSchool: z.string(),
});

export const StudentWithAssociationsSchema = BaseStudentSchema.extend({
  level: z.lazy(() => BaseLevelSchema),
  courses: z.lazy(() => BaseCourseSchema.array()),
  outlet: z.lazy(() => BaseOutletSchema),
  account: BaseAccountSchema,
});

export type BaseStudent = z.infer<typeof BaseStudentSchema>;
export type StudentWithAssociations = z.infer<
  typeof StudentWithAssociationsSchema
>;
