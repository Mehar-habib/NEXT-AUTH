import { db } from "@/lib/db";

/**
 * Fetches a verification token by its token value.
 *
 * @param {string} token - The token string to search for in the database.
 * @returns {Promise<object|null>} The verification token object if found, or null if not found.
 */
export const getVerificationTokenByToken = async (token: string) => {
  try {
    // Query the database for a verification token that matches the provided token
    const verificationToken = await db.verificationToken.findUnique({
      where: { token }, // Match the token in the database
    });
    return verificationToken; // Return the verification token object if found
  } catch {
    return null; // Return null if any error occurs
  }
};

/**
 * Fetches a verification token by email.
 *
 * @param {string} email - The email address to search for in the database.
 * @returns {Promise<object|null>} The verification token object if found, or null if not found.
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    // Query the database for a verification token that matches the provided email
    const verificationToken = await db.verificationToken.findFirst({
      where: { email }, // Match the email in the database
    });
    return verificationToken; // Return the verification token object if found
  } catch {
    return null; // Return null if any error occurs
  }
};
