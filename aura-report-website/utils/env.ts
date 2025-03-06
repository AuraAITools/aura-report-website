import { z } from "zod";
const envSchema = z.object({
  AUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  KEYCLOAK_CLIENT_ID: z.string(),
  KEYCLOAK_CLIENT_SECRET: z.string(),
  KEYCLOAK_ISSUER: z.string().url(),
  NODE_ENV: z.string(),
  NEXT_PUBLIC_REPORT_SERVICE_URL: z.string().url(),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = {
  AUTH_SECRET: process.env.AUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID!,
  KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET!,
  KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER!,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_REPORT_SERVICE_URL: process.env.NEXT_PUBLIC_REPORT_SERVICE_URL!,
};

export default env;
