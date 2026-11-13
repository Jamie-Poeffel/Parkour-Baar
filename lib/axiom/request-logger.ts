import "server-only";

import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/axiom/server";

type Fields = Record<string, unknown>;

export function serializeError(err: unknown): Fields {
    if (err instanceof Error) {
        return {
            error: err.message,
            errorName: err.name,
            stack: err.stack,
            ...(err.cause ? { cause: String(err.cause) } : {}),
        };
    }
    return { error: String(err) };
}

// Who/where context attached to every log line, so a Clerk session can be
// followed across requests: userId + sessionId + role + requestId + pathname.
async function context(): Promise<Fields> {
    const ctx: Fields = {};

    try {
        const h = await headers();
        const requestId = h.get("x-request-id");
        const pathname = h.get("x-pathname");
        if (requestId) ctx.requestId = requestId;
        if (pathname) ctx.pathname = pathname;
        ctx.userAgent = h.get("user-agent") ?? undefined;
    } catch {}

    try {
        const { userId, sessionId, sessionClaims } = await auth();
        ctx.userId = userId ?? "anonymous";
        if (sessionId) ctx.sessionId = sessionId;
        const role = (
            sessionClaims?.publicMetadata as { role?: string } | undefined
        )?.role;
        if (role) ctx.role = role;
    } catch {}

    return ctx;
}

async function withContext(fields: Fields) {
    // explicit fields win over derived context
    return { ...(await context()), ...fields };
}

export const requestLogger = {
    async info(message: string, fields: Fields = {}) {
        logger.info(message, await withContext(fields));
    },

    async warn(message: string, fields: Fields = {}) {
        logger.warn(message, await withContext(fields));
    },

    async error(message: string, fields: Fields = {}) {
        logger.error(message, await withContext(fields));
    },

    async flush() {
        await logger.flush();
    },
};
