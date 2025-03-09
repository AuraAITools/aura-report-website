import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token?.access_token;
    if (!token) {
      throw new Error("No token available");
    }

    // pass access token into the request to java backend
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);
    const correlationId = uuidv4();
    console.log(
      `received request ${req.url} with correlation id ${correlationId}`,
    );
    requestHeaders.set("X-correlation-id", correlationId);

    // rewrite the request url to include new Headers
    // this rewrite method is called before the rewrite method in next.config.mjs
    return NextResponse.rewrite(req.url, {
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // this function is called before middleware
    },
    pages: {
      signIn: "/",
      error: "/auth/error",
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|[^/]+\.[^/]+$).*)/", // exclude applying middleware on static resources and public images
    "/((?!api/auth).*)", // exclude applying middleware on next auth routes
    "/api/:path*", // apply middleware on requests all api routes
  ],
};
