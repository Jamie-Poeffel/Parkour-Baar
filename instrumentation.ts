import type { Instrumentation } from "next";

// Logs every uncaught server error (render, route handler, server action,
// proxy) with route, method, digest and stack.
export const onRequestError: Instrumentation.onRequestError = async (
    ...args
) => {
    if (process.env.NEXT_RUNTIME !== "nodejs") return;

    const { createOnRequestError } = await import("@axiomhq/nextjs");
    const { logger } = await import("@/lib/axiom/server");
    const handler = createOnRequestError(logger);
    await handler(...args);
    await logger.flush();
};
