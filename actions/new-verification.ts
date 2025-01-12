"use server";

// Import necessary data and database operations.
import { getUserByEmail } from "@/data/user"; // Fetches a user by their email.
import { getVerificationTokenByToken } from "@/data/verficiation-token"; // Fetches a verification token by its value.
import { db } from "@/lib/db"; // The database instance for executing queries.

// Function to handle email verification using a token.
// Parameters:
// - token: The unique verification token provided to the user.
export const newVerification = async (token: string) => {
  // Retrieve the verification token from the database.
  const existingToken = await getVerificationTokenByToken(token);

  // Check if the token exists. If not, return an error message.
  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  // Check if the token has expired by comparing its expiry time with the current time.
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // Retrieve the user associated with the token's email.
  const existingUser = await getUserByEmail(existingToken.email);

  // If no user is found with the email, return an error message.
  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  // Update the user's record to mark their email as verified and set their email.
  await db.user.update({
    where: { id: existingUser.id }, // Target the user by their ID.
    data: {
      emailVerified: new Date(), // Set the email verification timestamp to the current time.
      email: existingToken.email, // Ensure the email is updated to match the token.
    },
  });

  // Delete the used verification token from the database.
  await db.verificationToken.delete({
    where: { id: existingToken.id }, // Target the token by its ID.
  });

  // Return a success message indicating that the email has been verified.
  return { success: "Email verified!" };
};
