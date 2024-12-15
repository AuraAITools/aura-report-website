import { z } from "zod";

export const institutionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  uen: z.string().min(1),
  address: z.string().min(1),
  contactNumber: z.string().min(1),
});

export type Institution = z.infer<typeof institutionSchema>;
