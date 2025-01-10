import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);
// Destructure the `auth` method from NextAuth using the custom `authConfig`.

export default auth((req) => {
  const { nextUrl } = req; // Extract the `nextUrl` object from the request for route inspection.
  const isLoggedIn = !!req.auth; // Determine if the user is logged in (truthy value for `req.auth`).

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  // Check if the request is for an API authentication route (prefixed by `apiAuthPrefix`).

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  // Check if the request matches one of the defined public routes.

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  // Check if the request matches an authentication-related route (e.g., login or register).

  if (isApiAuthRoute) {
    return; // Do nothing for API authentication routes, allow them to proceed.
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      // If the user is logged in and accessing an auth route, redirect to the default logged-in page.
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return; // Allow unauthenticated users to access auth routes.
  }

  if (!isLoggedIn && !isPublicRoute) {
    // If the user is not logged in and is trying to access a protected route, redirect to the login page.
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return; // Allow all other cases (public routes or already handled routes) to proceed.
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
