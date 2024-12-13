import { z } from "zod";
const envSchema = z.object({
  AUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  KEYCLOAK_ID: z.string(),
  KEYCLOAK_SECRET: z.string(),
  KEYCLOAK_ISSUER: z.string().url(),
  NODE_ENV: z.string(),
});

export default envSchema.parse(envSchema);
