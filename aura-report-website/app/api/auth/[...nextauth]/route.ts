import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
      // profile: (profile,tokens) => {
      //   console.log(`${JSON.stringify(tokens)}`)
      //   return {
      //     id: profile.id
      //   } 
      // }
    }),
  ],
  useSecureCookies: process.env.NODE_ENV === 'production',
  events: {
    async signIn(message) { 
      /* on successful sign in */ 
      console.log(`user: ${JSON.stringify(message)}`)
    },
    async signOut(message) { /* on signout */ },
    async createUser(message) { /* user created */ },
    async updateUser(message) { /* user updated - e.g. their email was verified */ },
    async linkAccount(message) { /* account (e.g. Twitter) linked to a user */ },
    async session(message) { /* session is active */ },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  // callbacks: {
  //   async signIn({ user, account, profile, email, credentials }) {
  //     console.log(user);
  //     return true;
  //   },
  //   async redirect({ url, baseUrl }) {
  //     console.log(url);
  //     return baseUrl;
  //   },
  //   async session({ session, token, user }) {
  //     console.log(`${JSON.stringify(session)}`);
  //     console.log(`${JSON.stringify(token)}`);
  //     console.log(`${JSON.stringify(user)}`);

  //     return session;
  //   },
  //   async jwt({ token, user, account, profile, isNewUser }) {
  //     console.log(JSON.stringify(token))
  //       return token;
  //   },
  // }
});

export { handler as GET, handler as POST };
