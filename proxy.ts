import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasPermission } from "@/utils/permissions";
import { logger } from "@/lib/axiom/server";

const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);
const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/mitglieder(.*)",
  "/user-profile(.*)",
  "/auth-redirect",
]);

export default clerkMiddleware(async (auth, req) => {
  const start = Date.now();
  const { userId } = await auth();

  logger.info("request", {
    method: req.method,
    path: req.nextUrl.pathname,
    query: req.nextUrl.search || undefined,
    host: req.nextUrl.host,
    userId: userId ?? "anonymous",
    ip:
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown",
    userAgent: req.headers.get("user-agent") ?? "unknown",
    referer: req.headers.get("referer") ?? undefined,
    country: req.geo?.country ?? undefined,
    city: req.geo?.city ?? undefined,
    region: req.geo?.region ?? undefined,
    isProtected: isProtected(req),
    isAdmin: isAdminRoute(req),
    durationMs: Date.now() - start,
  });
  await logger.flush();

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
