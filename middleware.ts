import { auth } from "@/auth";

// Define the authentication handler.
// This middleware function handles incoming requests and checks if the user is logged in.
const authHandler = auth((req) => {
  const isLoggedIn = !!req.auth; // Determine if the user is logged in based on the presence of `req.auth`.
  console.log("Route", req.nextUrl.pathname); // Log the requested route's pathname.
  console.log("Is Logged In", isLoggedIn); // Log whether the user is authenticated or not.
});
export default authHandler; // Export the authentication handler as the default export.

// Configuration for the middleware.
// The `matcher` specifies which routes the middleware applies to, excluding specific paths like:
// - API routes (`/api`)
// - Static files (`/_next/static`)
// - Images (`/_next/image`)
// - Favicon (`/favicon.ico`)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
