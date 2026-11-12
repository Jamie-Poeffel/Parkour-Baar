import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

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
  const startedAt = performance.now();
  const requestId = randomUUID();

  let response: NextResponse | undefined;
  let status = 200;
  let failure: unknown;

  try {
    if (isProtected(req)) {
      const { sessionClaims } = await auth.protect();

      const role = (
        sessionClaims?.publicMetadata as { role?: string } | undefined
      )?.role;

      if (isAdminRoute(req) && !hasPermission(role, "dashboard:access")) {
        response = NextResponse.redirect(new URL("/mitglieder", req.url));
      } else if (req.nextUrl.pathname === "/auth-redirect") {
        const destination = hasPermission(role, "dashboard:access")
          ? "/dashboard"
          : "/mitglieder";

        response = NextResponse.redirect(new URL(destination, req.url));
      }
    }

    status = response?.status ?? 200;
  } catch (error) {
    failure = error;
    status = 500;
    throw error;
  } finally {
    const durationMs = Math.round(Number(performance.now() - startedAt) * 1000);

    const logFields = {
      requestId,
      method: req.method,
      pathname: req.nextUrl.pathname,
      status,
      durationMs,
    };

    if (failure) {
      logger.error("proxy.failed", {
        ...logFields,
        error: failure instanceof Error ? failure.message : String(failure),
      });
    } else {
      logger.info("request.completed", logFields);
    }
  }

  if (response) {
    response.headers.set("x-request-id", requestId);
    response.headers.set("x-pathname", req.nextUrl.pathname);
    return response;
  }

  const headers = new Headers(req.headers);
  headers.set("x-request-id", requestId);

  return NextResponse.next({
    request: { headers },
    headers: { "x-request-id": requestId },
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
