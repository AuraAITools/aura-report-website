import { z } from "zod";
export const BaseEducatorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export type BaseEducator = z.infer<typeof BaseEducatorSchema>;
