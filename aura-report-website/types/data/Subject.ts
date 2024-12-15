import { z } from "zod";

export const subjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export type Subject = z.infer<typeof subjectSchema>;
