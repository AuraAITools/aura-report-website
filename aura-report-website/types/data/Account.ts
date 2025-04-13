import { z } from "zod";

export const ACCOUNT_RELATIONSHIP = ["PARENT", "SELF"] as const;

export const BaseAccountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  contact: z.string(),
  pending_account_actions: z.string().array(),
  personas: z.array(z.lazy(() => PersonaSchema)),
});

export const PersonaSchema = z.object({
  id: z.string().uuid(),
  display_roles: z.string().array(),
});

export type BaseAccount = z.infer<typeof BaseAccountSchema>;
