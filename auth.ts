import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    // This callback is triggered whenever a session is checked or created.
    // It modifies the session object to include the user's ID (from the JWT token).
    async session({ token, session }) {
      // If the token has a "sub" property (user ID) and session.user exists,
      // assign the user's ID to session.user.id for client-side access.
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // Return the modified session object.
      return session;
    },

    // This callback is triggered whenever a JWT is created or updated.
    // It allows customizing the JWT token before it is sent to the client.
    async jwt({ token }) {
      // In this case, the token is returned unmodified.
      return token;
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
