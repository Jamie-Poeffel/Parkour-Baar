"use client";

// Browser -> /api/log-error. Server adds userId/sessionId/role from Clerk.
export function reportClientError(
    source: string,
    err: unknown,
    extra: Record<string, unknown> = {},
) {
    const e = err instanceof Error ? err : new Error(String(err));
    try {
        fetch("/api/log-error", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                source,
                message: e.message,
                name: e.name,
                stack: e.stack,
                url: window.location.pathname + window.location.search,
                ...extra,
            }),
            keepalive: true,
        }).catch(() => {});
    } catch {}
}
