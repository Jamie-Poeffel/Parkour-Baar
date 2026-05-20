"use client";

import Link from "next/link";
import { useEffect } from "react";
import { captureException } from "@/components/LogRocket";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        captureException(error);
    }, [error]);

    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-4">
                Fehler 500
            </p>
            <h1 className="text-7xl md:text-9xl font-black tracking-tight text-neutral-900 leading-none mb-6">
                Oops.
            </h1>
            <p className="text-lg text-neutral-500 max-w-sm mb-10">
                Etwas ist schiefgelaufen. Wir wurden benachrichtigt und kümmern uns darum.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-neutral-900 text-white font-semibold rounded-md hover:bg-neutral-700 transition-colors"
                >
                    Nochmal versuchen
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-md hover:border-neutral-500 transition-colors"
                >
                    Startseite
                </Link>
            </div>
        </section>
    );
}
