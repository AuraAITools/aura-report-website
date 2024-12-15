import { z } from "zod";
const envSchema = z.object({
  AUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  KEYCLOAK_ID: z.string(),
  KEYCLOAK_SECRET: z.string(),
  KEYCLOAK_ISSUER: z.string().url(),
  NODE_ENV: z.string(),
});

type EnvType = z.infer<typeof envSchema>;

const env: EnvType = {
  AUTH_SECRET: process.env.AUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  KEYCLOAK_ID: process.env.KEYCLOAK_ID!,
  KEYCLOAK_SECRET: process.env.KEYCLOAK_SECRET!,
  KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER!,
  NODE_ENV: process.env.NODE_ENV,
};

export default envSchema.parse(env);
