import { z } from "zod";

export const ACCOUNT_RELATIONSHIP = ["PARENT", "SELF"] as const;
export const BaseAccountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  contact: z.string(),
  relationship: z.enum(ACCOUNT_RELATIONSHIP),
});

export type BaseAccount = z.infer<typeof BaseAccountSchema>;
