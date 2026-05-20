import { clerkMiddleware } from "@clerk/nextjs/server";
import { Logger } from "next-axiom";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const log = new Logger({ source: "middleware" });
    const { userId } = await auth();

    log.info("request", {
        method: req.method,
        path: req.nextUrl.pathname,
        userId: userId ?? "anonymous",
    });

    await log.flush();
    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
