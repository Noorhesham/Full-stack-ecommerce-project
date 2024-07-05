import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { publicRoutes, apiAuthPrefix, authRoutes, defaultLoginRedirect } from "./route";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!session;
  const isApiRoute = url.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(url.pathname);
  const isAuthRoute = authRoutes.includes(url.pathname);
  if (isApiRoute) {
    return NextResponse.next();
  }
  if (isLoggedIn) {
    // If the user is admin and the path does not start with /admin, redirect to /admin
    //@ts-ignore
    if (session.user.isAdmin) {
      if (!url.pathname.startsWith("/admin")) {
        const adminUrl = new URL(`/admin${url.pathname}`, url);
        return NextResponse.redirect(adminUrl);
      }
    } else {
      // If the user is not an admin and the path starts with /admin, redirect to home
      if (url.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", url));
      }
    }
    return NextResponse.next();
  }
  if (isAuthRoute) {
    //@ts-ignore
    if (isLoggedIn && session.user.isAdmin && !url.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", url));
    } else if (isLoggedIn) {
      return NextResponse.redirect(new URL(defaultLoginRedirect, url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
