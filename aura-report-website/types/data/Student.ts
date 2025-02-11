import { z } from "zod";
import { ACCOUNT_RELATIONSHIP } from "./Account";
import { BaseCourseSchema } from "./Course";
import { BaseLevelSchema } from "./Level";
import { BaseOutletSchema } from "./Outlet";

export const BaseStudentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  date_of_birth: z.coerce.date(), // handle string dates
  current_school: z.string(),
  contact: z.string(),
  relationship: z.enum(ACCOUNT_RELATIONSHIP),
});

export const StudentWithAssociationsSchema = BaseStudentSchema.extend({
  current_level: z.lazy(() => BaseLevelSchema),
  courses: z.lazy(() => BaseCourseSchema.array()),
  outlets: z.lazy(() => BaseOutletSchema.array()),
});

export type BaseStudent = z.infer<typeof BaseStudentSchema>;
export type StudentWithAssociations = z.infer<
  typeof StudentWithAssociationsSchema
>;
