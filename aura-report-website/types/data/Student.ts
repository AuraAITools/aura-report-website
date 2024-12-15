import { z } from "zod";

export const studentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  dateOfBirth: z.date(),
  currentSchool: z.string(),
  currentLevel: z.string(),
});

export type Student = z.infer<typeof studentSchema>;
