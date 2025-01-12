"use server";

// Import necessary modules and functions.
import { getUserByEmail } from "@/data/user"; // Function to retrieve a user by their email.
import { ResetSchema } from "@/schemas"; // Schema for validating reset request fields.
import * as z from "zod"; // Zod library for schema validation and type inference.

// Function to handle password reset requests.
// Parameters:
// - values: An object containing the reset request fields (validated against the ResetSchema).
export const reset = async (values: z.infer<typeof ResetSchema>) => {
  // Validate the provided values against the ResetSchema.
  const validatedFields = ResetSchema.safeParse(values);

  // If validation fails, return an error message indicating invalid email format.
  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  // Extract the validated email from the input data.
  const { email } = validatedFields.data;

  // Check if a user exists with the provided email.
  const existingUser = await getUserByEmail(email);

  // If no user is found, return an error message indicating the email is not registered.
  if (!existingUser) {
    return { error: "Email not found" };
  }

  // TODO: Generate a reset token and send a password reset email to the user.
  // This step will involve creating a secure token, storing it, and sending an email with the token.

  // Return a success message indicating the reset email has been sent.
  return { success: "Reset email sent!" };
};
