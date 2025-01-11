import { getVerificationTokenByEmail } from "@/data/verficiation-token"; // Function to fetch an existing verification token by email
import { v4 as uuidv4 } from "uuid"; // Library to generate unique tokens
import { db } from "./db"; // Prisma client instance for database operations

/**
 * Generates a verification token for the provided email.
 * - Creates a new unique token.
 * - Deletes any existing token for the given email to avoid duplicates.
 * - Saves the new token to the database with an expiration time.
 *
 * @param {string} email - The email address to associate with the verification token.
 * @returns {Promise<object>} The newly created verification token object.
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4(); // Generate a unique token
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Set token expiration to 1 hour from now

  // Check if a token already exists for the email
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    // If an existing token is found, delete it to ensure uniqueness
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Create and store a new verification token in the database
  const verificationToken = await db.verificationToken.create({
    data: {
      email, // Associate the token with the given email
      token, // The generated unique token
      expires, // Expiration time for the token
    },
  });

  return verificationToken; // Return the newly created verification token
};
