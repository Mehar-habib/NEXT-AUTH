"use server";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

/**
 * Handles the process of updating a user's password.
 * - Validates the provided token and password fields.
 * - Verifies the token exists, has not expired, and matches a valid user.
 * - Updates the user's password and removes the token after successful update.
 *
 * @param {z.infer<typeof NewPasswordSchema>} values - The input fields for the new password.
 * @param {string | null | undefined} token - The password reset token to validate.
 * @returns {Promise<object>} Response object containing success or error messages.
 */
export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  // Ensure a token is provided
  if (!token) {
    return { error: "Missing token!" };
  }

  // Validate the input fields using the schema
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" }; // Return an error if validation fails
  }
  const { password } = validatedFields.data; // Extract the validated password

  // Fetch the token record from the database
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token" }; // Return an error if token doesn't exist
  }

  // Check if the token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" }; // Return an error if token has expired
  }

  // Fetch the user associated with the token's email
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist" }; // Return an error if user is not found
  }

  // Hash the new password for secure storage
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user's password in the database
  await db.user.update({
    where: { id: existingUser.id }, // Identify user by their ID
    data: { password: hashedPassword }, // Update password with the hashed value
  });

  // Delete the used password reset token
  await db.passwordResetToken.delete({
    where: { id: existingToken.id }, // Identify token by its ID
  });

  // Return success response
  return { success: "Password updated!" };
};
