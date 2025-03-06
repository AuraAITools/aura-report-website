import { logoutRequest, refreshTokenRequest } from "@/lib/auth/oidc";
import env from "@/utils/env";
import NextAuth, { User } from "next-auth";
import { ProviderType } from "next-auth/providers/index";
import KeycloakProvider from "next-auth/providers/keycloak";
const authOptions = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_CLIENT_SECRET!,
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
      console.log(
        `sign in callback with user: ${JSON.stringify(user, null, 2)}`,
      );
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
      console.log("session callback!");
      console.log(`session : ${JSON.stringify(session, null, 2)}`);
      console.log(`session token ${JSON.stringify(token, null, 2)}`);
      // session.error = token.error;
      // session.access_token = token.access_token;
      session.user = token.user;
      session.error = token.error;
      console.log(`session after ${JSON.stringify(session, null, 2)}`);

      return session;
    },
    async jwt({ token, user, account, profile }) {
      // first time sign in
      if (account && user) {
        console.log(`JWT token ${JSON.stringify(token, null, 2)}`);
        console.log(`User ${JSON.stringify(user, null, 2)}`);
        console.log(`Account ${JSON.stringify(account, null, 2)}`);
        console.log(`Profile ${JSON.stringify(profile, null, 2)}`);
        // Update token with account information
        token.access_token = account.access_token;

        // TODO: define the decoded access token type
        let jsonPayload = JSON.parse(
          Buffer.from(token.access_token.split(".")[1], "base64").toString(),
        );

        // get roles
        let roles = jsonPayload["resource_access"][env.KEYCLOAK_CLIENT_ID][
          "roles"
        ] as string[];
        console.log(
          `extracted roles from access token ${JSON.stringify(roles)}`,
        );

        // add roles to user details
        user.roles = roles;
        // add user details into token to pass to session later
        token.user = user;

        token.refresh_token = account.refresh_token;
        token.refresh_token_expired =
          Date.now() + account.refresh_expires_in * 1000;
        token.access_token_expired = Date.now() + account.expires_in * 1000;

        return token;
      }

      // subsequent calls to session
      console.log(
        `Attempting to refresh token: ${JSON.stringify(token.refresh_token, null, 2)}`,
      );

      // if access token has yet to expire, return same token
      if (Date.now() < token.expires_in) {
        return token;
      }

      // if refresh token is 5 s from expiring, prompt user to sign in again
      if (token.refresh_expires_in + 5 * 1000 >= Date.now()) {
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }

      // else attempt to refresh token
      // Send a post request to refresh the token
      let response;
      try {
        response = await refreshTokenRequest(token.refresh_token);
        console.log(`error; ${JSON.stringify(response.data, null, 2)}`);
      } catch (error) {
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }

      // refreshed successfully
      const tokens = response.data;
      console.log(
        `successfully refreshed token with new access token: ${JSON.stringify(tokens.access_token, null, 2)}`,
      );

      // Update cookie token with refreshed information
      return {
        ...token,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        refresh_token_expired: Date.now() + tokens.refresh_expires_in * 1000,
        expires_in: tokens.expires_in,
        error: null,
      };
    },
  },
});

// Declare custom types for NextAuth modules
declare module "next-auth" {
  // Define custom session properties
  interface Session {
    user: User;
    error?: string | null;
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
    ext_attrs: {
      tenant_ids: string[];
    };
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
    user: User;
    roles: string[];
    error?: string | null;
  }
}

export { authOptions as GET, authOptions as POST };
