import { z } from "zod";
import { BaseInstitutionSchema } from "./Institution";
export const BaseOutletSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string(),
  postal_code: z.string(),
  contact_number: z.string(),
  // institution: BaseInstitutionSchema.optional(),
});

export type BaseOutlet = z.infer<typeof BaseOutletSchema>;

export const OutletWithAssociationsSchema = BaseOutletSchema.extend({
  institution: BaseInstitutionSchema,
});

export type OutletWithAssociations = z.infer<
  typeof OutletWithAssociationsSchema
>;
