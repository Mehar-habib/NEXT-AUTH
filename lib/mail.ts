// Import the Resend library to handle email sending functionality.
import { Resend } from "resend";

// Initialize the Resend instance with the API key stored in environment variables.
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send a verification email with a confirmation link.
// Parameters:
// - email: The recipient's email address.
// - token: The unique verification token used to verify the user's email.
export const sendVerificationEmail = async (email: string, token: string) => {
  // Construct the email confirmation link with the provided token.
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  // Use the Resend API to send the email.
  await resend.emails.send({
    from: "onboarding@resend.dev", // Sender email address.
    to: email, // Recipient email address.
    subject: "Confirm your email", // Email subject line.
    // HTML content of the email, including the confirmation link.
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};
