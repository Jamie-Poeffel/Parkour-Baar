import "server-only";

import { requestLogger, serializeError } from "@/lib/axiom/request-logger";
import { startTimer, getDurationMs } from "@/lib/axiom/timing";

// Runs a server action body and logs who did what, how long it took, and the
// full error (message + stack) when it broke. Rethrows so callers still fail.
export async function logAction<T>(
    name: string,
    meta: Record<string, unknown>,
    fn: () => Promise<T>,
): Promise<T> {
    const start = startTimer();

    try {
        const result = await fn();
        await requestLogger.info(`action:${name}`, {
            action: name,
            outcome: "success",
            ...meta,
            durationMs: getDurationMs(start),
        });
        return result;
    } catch (err) {
        // redirect()/notFound() throw control-flow errors; don't log them as failures
        if (
            err instanceof Error &&
            "digest" in err &&
            String((err as { digest?: unknown }).digest).startsWith("NEXT_")
        ) {
            throw err;
        }

        await requestLogger.error(`action:${name}:error`, {
            action: name,
            outcome: "error",
            ...meta,
            ...serializeError(err),
            durationMs: getDurationMs(start),
        });
        await requestLogger.flush();
        throw err;
    }
}
