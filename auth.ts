import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Customize sign-in and error pages
  pages: {
    signIn: "/auth/login", // Custom sign-in page
    error: "/auth/error", // Custom error page
  },
  events: {
    // Event triggered when a new account is linked
    async linkAccount({ user }) {
      // Automatically verify the email when linking an account
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    // Callback to control the sign-in process
    async signIn({ user, account }) {
      // Allow sign-in for OAuth providers without email verification
      if (account?.provider !== "credentials") return true;

      // Fetch the user by ID
      const existingUser = await getUserById(user.id as string);

      // Prevent sign-in if the email is not verified
      if (!existingUser?.emailVerified) return false;

      // If two-factor authentication is enabled, validate the 2FA token
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        // Deny access if the 2FA confirmation token is missing
        if (!twoFactorConfirmation) return false;

        // Delete the 2FA confirmation to enforce a fresh check on the next sign-in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }
      return true; // Allow sign-in if all checks pass
    },
    // Callback to include additional information in the session
    async session({ token, session }) {
      // Attach the user ID to the session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // Attach the user role to the session
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    // Callback to handle custom JWT token processing
    async jwt({ token }) {
      // Skip processing if the token lacks a subject (user ID)
      if (!token.sub) return token;

      // Fetch the user by ID
      const existingUser = await getUserById(token.sub);

      // Skip processing if the user does not exist
      if (!existingUser) return token;

      // Add the user's role to the token
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db), // Use PrismaAdapter to handle database operations
  session: { strategy: "jwt" }, // Use JWT for session management
  ...authConfig, // Spread additional authentication configurations
});
