import { logoutRequest, refreshTokenRequest } from "@/lib/auth/oidc";
import env from "@/utils/env";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { ProviderType } from "next-auth/providers/index";
import KeycloakProvider from "next-auth/providers/keycloak";
const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: env.KEYCLOAK_ID,
      clientSecret: env.KEYCLOAK_SECRET!,
      issuer: env.KEYCLOAK_ISSUER,
      profile: (profile) => {
        profile.id = profile.sub;
        return profile;
      },
    }),
  ],

  useSecureCookies: env.NODE_ENV === "production",
  events: {
    // async signIn(message) {
    //   /* on successful sign in */
    //   console.log(`user: ${JSON.stringify(message)}`)
    // },
    async signOut({ token }) {
      await logoutRequest(token.refresh_token);
    },
    // async createUser(message) {
    //   /* user created */
    // },
    // async updateUser(message) {
    //   /* user updated - e.g. their email was verified */
    // },
    // async linkAccount(message) {
    //   /* account (e.g. Twitter) linked to a user */
    // },
    // async session(message) {
    //   /* session is active */
    // },
  },
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for check email message)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(`over here: ${JSON.stringify(user)}`);
      return true;
    },
    async redirect({ url, baseUrl }) {
      // resolve relative urls with the absolute url
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.error = token.error;
      session.roles = token.roles;
      session.access_token = token.access_token;
      console.log(`session session: ${JSON.stringify(session)}`);
      console.log(`session token ${JSON.stringify(token)}`);
      return session;
    },
    // run before encrypting the session cookie
    async jwt({ token, account, profile }) {
      if (account) {
        console.log(`JWT token ${JSON.stringify(token)}`);
        // Update token with account information
        token.access_token = account.access_token;

        let jsonPayload = JSON.parse(
          Buffer.from(token.access_token.split(".")[1], "base64").toString(),
        );

        // get roles
        let roles = jsonPayload["resource_access"]["local-next-client"][
          "roles"
        ] as string[];
        console.log(JSON.stringify(roles));
        token.roles = roles;
        token.refresh_token = account.refresh_token;
        token.access_token_expired =
          Date.now() + (account.expires_in - 15) * 1000;
        token.refresh_token_expired =
          Date.now() + (account.refresh_expires_in - 15) * 1000;
        return token;
      } else {
        if (!token.refresh_token) {
          console.error("No refresh token available");
          return null as unknown as JWT;
        }
        try {
          // Send a post request to refresh the token
          console.log(`Attempting to refresh token: ${token.refresh_token}`);
          const response = await refreshTokenRequest(token.refresh_token);
          console.log(
            `response refresh token: ${JSON.stringify(response.data)}`,
          );
          if (response.status !== 200) {
            console.error(`refresh tokens failed`, response);
            return null as unknown as JWT;
          }
          const tokens = response.data;

          // Update token with refreshed information
          return {
            ...token,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token ?? token.refresh_token,
            refresh_token_expired:
              tokens.refresh_expires_in ?? token.refresh_token_expired,
            expires_in: Math.floor(Date.now() / 1000 + tokens.expires_in),
            error: null,
          };
        } catch (e) {
          console.error(e);
          return null as unknown as JWT;
        }
      }
    },
  },
});

// Declare custom types for NextAuth modules
declare module "next-auth" {
  // Define custom session properties
  interface Session {
    user: {
      sub: string;
      email_verified: boolean;
      name: string;
      preferred_username: string;
      given_name: string;
      family_name: string;
      email: string;
      id: string;
      org_name?: string;
      telephone?: string;
      // roles: string[];
    };
    roles: string[];
    error?: string | null;
    access_token: string;
  }

  // Define custom user properties
  interface User {
    sub: string;
    email_verified: boolean;
    name: string;
    telephone: string;
    preferred_username: string;
    org_name: string;
    given_name: string;
    family_name: string;
    email: string;
    id: string;
    roles: string[];
  }

  // Define custom account properties
  interface Account {
    "provider": string;
    "type": ProviderType;
    "id": string;
    "access_token": string;
    "refresh_token": string;
    "idToken": string;
    "expires_in": number;
    "refresh_expires_in": number;
    "token_type": string;
    "id_token": string;
    "not-before-policy": number;
    "session_state": string;
    "scope": string;
    "roles": string[];
  }

  // Define custom profile properties
  interface Profile {
    sub?: string;
    email_verified: boolean;
    name?: string;
    telephone: string;
    preferred_username: string;
    org_name: string;
    given_name: string;
    family_name: string;
    email?: string;
  }
}

// Declare custom JWT properties
declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token: string;
    refresh_expires_in: number;
    expires_in: number;
    user: {
      sub: string;
      email_verified: boolean;
      name: string;
      telephone: string;
      preferred_username: string;
      org_name: string;
      given_name: string;
      family_name: string;
      email: string;
      id: string;
    };
    roles: string[];
    error?: string | null;
  }
}

export { handler as GET, handler as POST };
