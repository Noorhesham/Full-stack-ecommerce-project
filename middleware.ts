import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { publicRoutes, apiAuthPrefix, authRoutes, defaultLoginRedirect } from "./route";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!session;
  const isApiRoute = url.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace(/\[.*\]/, ".*")}$`);
    return regex.test(url.pathname);
  });
  const isAuthRoute = authRoutes.includes(url.pathname);

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isLoggedIn) {
    // Admin specific redirection logic
    //@ts-ignore
    if (session.user.isAdmin) {
      // Redirect admins to /admin if they are not already on /admin
      if (
        !url.pathname.startsWith("/admin") &&
        !isPublicRoute &&
        !url.pathname.startsWith("/cart") &&
        !url.pathname.startsWith("/thank-you")
      ) {
        url.pathname = `/admin`;
        return NextResponse.redirect(url);
      }
    } else {
      // Redirect non-admins away from /admin
      if (url.pathname.startsWith("/admin")) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }

    if (isAuthRoute) {
      url.pathname = defaultLoginRedirect;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    //@ts-ignore
    if (isLoggedIn && session.user.isAdmin && !url.pathname.startsWith("/admin")) {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    } else if (isLoggedIn) {
      url.pathname = defaultLoginRedirect;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
