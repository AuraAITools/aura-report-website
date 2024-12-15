import { z } from "zod";

export const accountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  contact: z.string(),
});

export type Account = z.infer<typeof accountSchema>;
