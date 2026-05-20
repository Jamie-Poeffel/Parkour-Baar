"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import LogRocket from "logrocket";

const STORAGE_KEY = "cookie_consent";

let lrInitialized = false;

function initLogRocket(userId?: string, name?: string, email?: string) {
    if (lrInitialized) return;
    const appId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID;
    if (!appId) return;
    LogRocket.init(appId);
    lrInitialized = true;
    if (userId) LogRocket.identify(userId, { name: name ?? "", email: email ?? "" });
}

export function trackEvent(name: string) {
    if (lrInitialized) LogRocket.track(name);
}

export function captureException(err: Error) {
    if (lrInitialized) LogRocket.captureException(err);
}

export function CookieConsent() {
    const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as typeof consent;
        setConsent(stored);
    }, []);

    useEffect(() => {
        if (consent === "accepted" && isLoaded) {
            initLogRocket(
                user?.id,
                user?.fullName ?? "",
                user?.primaryEmailAddress?.emailAddress ?? ""
            );
        }
    }, [consent, isLoaded, user]);

    function accept() {
        localStorage.setItem(STORAGE_KEY, "accepted");
        setConsent("accepted");
    }

    function decline() {
        localStorage.setItem(STORAGE_KEY, "declined");
        setConsent("declined");
    }

    const gaId = process.env.NEXT_PUBLIC_GA_ID;

    return (
        <>
            {/* Load GA only after consent */}
            {consent === "accepted" && gaId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="ga-init" strategy="afterInteractive">{`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gaId}');
                    `}</Script>
                </>
            )}

            {/* Banner */}
            {consent === null && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
                    <div className="max-w-2xl mx-auto bg-neutral-900 text-white rounded-xl shadow-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <p className="text-sm text-neutral-300 flex-1 leading-relaxed">
                            Wir verwenden Cookies für Analyse und Session-Aufzeichnung, um
                            unsere Website zu verbessern.{" "}
                            <a
                                href="/datenschutz"
                                className="underline underline-offset-2 hover:text-white transition-colors"
                            >
                                Datenschutz
                            </a>
                        </p>
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={decline}
                                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors rounded-md hover:bg-neutral-800"
                            >
                                Ablehnen
                            </button>
                            <button
                                onClick={accept}
                                className="px-4 py-2 text-sm font-semibold bg-white text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors"
                            >
                                Akzeptieren
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
