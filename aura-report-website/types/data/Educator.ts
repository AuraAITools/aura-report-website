import { z } from "zod";
import { BaseLevelSchema } from "./Level";
import { BaseOutletSchema } from "./Outlet";
import { BaseSubjectSchema } from "./Subject";

const EMPLOYMENT_TYPE = ["FULL_TIME", "PART_TIME"] as const;
export const BaseEducatorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  start_date: z.string().date(),
  employment_type: z.enum(EMPLOYMENT_TYPE),
  levels: z.lazy(() => BaseLevelSchema.array()),
  subjects: z.lazy(() => BaseSubjectSchema.array()),
  outlets: z.lazy(() => BaseOutletSchema.array()),
});

export type BaseEducator = z.infer<typeof BaseEducatorSchema>;

export const BaseEducatorClientSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  contact: z.string(),
  educator: BaseEducatorSchema,
});

export type BaseEducatorClientSchema = z.infer<typeof BaseEducatorClientSchema>;
