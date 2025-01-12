import { getVerificationTokenByEmail } from "@/data/verficiation-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import crypto from "crypto";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(10_000, 1_000_000).toString();

  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }
  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return twoFactorToken;
};
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4(); // Generate a unique token
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Set token expiration to 1 hour from now

  // Check if a password reset token already exists for the given email
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    // If an existing token is found, delete it to avoid duplicates
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }, // Use the token's ID to delete it
    });
  }

  // Create and store a new password reset token in the database
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email, // Associate the token with the provided email
      token, // Store the newly generated token
      expires, // Set the token's expiration time
    },
  });

  return passwordResetToken; // Return the newly created password reset token
};

/**
 * Generates a verification token for the provided email.
 * - Creates a unique token using UUID.
 * - Deletes any existing verification token for the email to ensure uniqueness.
 * - Stores the new token in the database with an expiration time.
 *
 * @param {string} email - The email address to associate with the verification token.
 * @returns {Promise<object>} The newly created verification token object.
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4(); // Generate a unique token
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Set token expiration to 1 hour from now

  // Check if a verification token already exists for the email
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    // If an existing token is found, delete it to ensure only one active token per email
    await db.verificationToken.delete({
      where: {
        id: existingToken.id, // Use the token's ID to delete it
      },
    });
  }

  // Create and store a new verification token in the database
  const verificationToken = await db.verificationToken.create({
    data: {
      email, // Associate the token with the provided email
      token, // Store the newly generated token
      expires, // Set the token's expiration time
    },
  });

  return verificationToken; // Return the newly created verification token
};
