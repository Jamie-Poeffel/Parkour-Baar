"use client";

import { useEffect } from "react";
import { reportClientError } from "@/lib/axiom/report-client-error";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        reportClientError("global_error_boundary", error, {
            digest: error.digest,
        });
    }, [error]);

    return (
        <html lang="de">
            <body
                style={{
                    fontFamily: "system-ui, sans-serif",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "1.5rem",
                }}
            >
                <p
                    style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#566246",
                    }}
                >
                    Fehler 500
                </p>
                <h1
                    style={{
                        fontSize: "4rem",
                        fontWeight: 900,
                        margin: "1rem 0",
                    }}
                >
                    Oops.
                </h1>
                <p
                    style={{
                        color: "#737373",
                        maxWidth: "24rem",
                        marginBottom: "2rem",
                    }}
                >
                    Etwas ist schiefgelaufen. Wir wurden benachrichtigt und
                    kümmern uns darum.
                </p>
                <button
                    onClick={reset}
                    style={{
                        padding: "0.75rem 1.5rem",
                        background: "#171717",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "0.375rem",
                        border: 0,
                        cursor: "pointer",
                    }}
                >
                    Nochmal versuchen
                </button>
            </body>
        </html>
    );
}
