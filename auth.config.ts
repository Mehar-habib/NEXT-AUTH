import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";

// NextAuth configuration for setting up the authentication flow
export default {
  providers: [
    // Using the Credentials provider for handling custom authentication
    Credentials({
      // `authorize` function defines the custom authentication logic
      authorize: async (credentials) => {
        // Validating credentials using the LoginSchema
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          // Destructuring the email and password from the validated data
          const { email, password } = validatedFields.data;

          // Fetching the user by email from the database
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null; // If no user or no password found, return null

          // Comparing the entered password with the hashed password stored in the database
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            // If passwords match, return the user object (authenticated successfully)
            return user;
          }
        }
        // If authentication fails, return null
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig; // Ensures the configuration satisfies the NextAuthConfig type
