import { z } from "zod";

export const courseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export type Course = z.infer<typeof courseSchema>;
