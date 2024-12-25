import { z } from "zod";
export const educatorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export type Educator = z.infer<typeof educatorSchema>;
