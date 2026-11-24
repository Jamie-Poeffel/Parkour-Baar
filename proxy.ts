import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
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
    let role: string | undefined;
    let redirectedTo: string | undefined;

    try {
        if (isProtected(req)) {
            const { sessionClaims } = await auth.protect();

            role = (
                sessionClaims?.publicMetadata as { role?: string } | undefined
            )?.role;

            if (isAdminRoute(req) && !hasPermission(role, "dashboard:access")) {
                redirectedTo = "/mitglieder";
                response = NextResponse.redirect(
                    new URL(redirectedTo, req.url),
                );
            } else if (req.nextUrl.pathname === "/auth-redirect") {
                const destination = hasPermission(role, "dashboard:access")
                    ? "/dashboard"
                    : "/mitglieder";

                redirectedTo = destination;
                response = NextResponse.redirect(new URL(destination, req.url));
            }
        }

        status = response?.status ?? 200;
    } catch (error) {
        // auth.protect() throws a NEXT_REDIRECT (to sign-in) for signed-out
        // visitors and link-preview bots. That is control flow, not a failure.
        const digest = (error as { digest?: unknown } | null)?.digest;
        if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
            status = 307;
            redirectedTo = "sign-in";
        } else {
            failure = error;
            status = 500;
        }
        throw error;
    } finally {
        const durationMs = Math.round(performance.now() - startedAt);

        let userId: string | null = null;
        let sessionId: string | null = null;
        try {
            ({ userId, sessionId } = await auth());
        } catch {}

        const logFields = {
            requestId,
            userId: userId ?? "anonymous",
            sessionId: sessionId ?? undefined,
            role,
            redirectedTo,
            userAgent: req.headers.get("user-agent") ?? undefined,
            method: req.method,
            pathname: req.nextUrl.pathname,
            status,
            durationMs,
        };

        if (failure) {
            logger.error("proxy.failed", {
                ...logFields,
                error:
                    failure instanceof Error
                        ? failure.message
                        : String(failure),
                stack: failure instanceof Error ? failure.stack : undefined,
            });
            await logger.flush();
        } else {
            logger[status >= 400 ? "warn" : "info"](
                "request.completed",
                logFields,
            );
        }
    }

    if (response) {
        response.headers.set("x-request-id", requestId);
        response.headers.set("x-pathname", req.nextUrl.pathname);
        return response;
    }

    const headers = new Headers(req.headers);
    headers.set("x-request-id", requestId);
    // Request header too, so server components (e.g. not-found) see the route.
    headers.set("x-pathname", req.nextUrl.pathname);

    return NextResponse.next({
        request: { headers },
        headers: { "x-request-id": requestId },
    });
});

export const config = {
    matcher: [
        "/((?!_next|api/health$|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api(?!/health$)|trpc)(.*)",
    ],
};
