import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

const authHandler = auth((req) => {
  const isLoggedIn = !!req.auth;
  console.log("Route", req.nextUrl.pathname);
  console.log("Is Logged In", isLoggedIn);
});
export default authHandler;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
