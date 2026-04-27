import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/permissions";

const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);
const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/mitglieder(.*)",
  "/user-profile(.*)",
  "/auth-redirect",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isProtected(req)) return;

  const { sessionClaims } = await auth.protect();
  const role = (sessionClaims?.publicMetadata as { role?: string } | undefined)
    ?.role;

  // Non-admins trying to access dashboard → send to member area
  if (isAdminRoute(req) && !hasPermission(role, "dashboard:access")) {
    return NextResponse.redirect(new URL("/mitglieder", req.url));
  }

  // Already-authed users hitting /auth-redirect → route by role
  if (req.nextUrl.pathname === "/auth-redirect") {
    const dest = hasPermission(role, "dashboard:access")
      ? "/dashboard"
      : "/mitglieder";
    return NextResponse.redirect(new URL(dest, req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
