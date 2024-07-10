import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { publicRoutes, apiAuthPrefix, authRoutes, defaultLoginRedirect } from "./route";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!session;
  const isApiRoute = url.pathname.startsWith(apiAuthPrefix);
  console.log(req.url);
  const isPublicRoute = publicRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace(/\[.*\]/, ".*")}$`);
    return regex.test(url.pathname);
  });
  const isAuthRoute = authRoutes.includes(url.pathname);

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isLoggedIn) {
    // Redirect admins to /admin if not already on /admin
    //@ts-ignore
    if (session.user.isAdmin && !url.pathname.startsWith("/admin")) {
      url.pathname = `/admin`;
      return NextResponse.redirect(url);
    }
    // Redirect non-admins away from /admin
    //@ts-ignore
    if (!session.user.isAdmin && url.pathname.startsWith("/admin")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    if (isAuthRoute) {
      url.pathname = defaultLoginRedirect;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    // Handle authenticated routes
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
