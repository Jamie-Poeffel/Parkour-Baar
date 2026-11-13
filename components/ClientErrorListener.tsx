"use client";

import { useEffect } from "react";
import { reportClientError } from "@/lib/axiom/report-client-error";

export function ClientErrorListener() {
    useEffect(() => {
        const onError = (e: ErrorEvent) =>
            reportClientError("window.onerror", e.error ?? e.message, {
                filename: e.filename,
                line: e.lineno,
            });
        const onRejection = (e: PromiseRejectionEvent) =>
            reportClientError("unhandledrejection", e.reason);

        window.addEventListener("error", onError);
        window.addEventListener("unhandledrejection", onRejection);
        return () => {
            window.removeEventListener("error", onError);
            window.removeEventListener("unhandledrejection", onRejection);
        };
    }, []);

    return null;
}
