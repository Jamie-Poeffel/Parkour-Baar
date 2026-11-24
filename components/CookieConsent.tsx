"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";

const STORAGE_KEY = "cookie_consent";

// "pending" = not yet read on the client (server render / hydration),
// "none" = visitor has not chosen yet.
type Consent = "accepted" | "declined" | "none" | "pending";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Consent {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "accepted" || stored === "declined" ? stored : "none";
  } catch {
    return "none";
  }
}

function getServerSnapshot(): Consent {
  return "pending";
}

function saveConsent(value: "accepted" | "declined") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable: choice only lasts until reload */
  }
  listeners.forEach((listener) => listener());
}

export function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function accept() {
    saveConsent("accepted");
  }

  function decline() {
    saveConsent("declined");
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {/* Load GA only after consent and only in production */}
      {consent === "accepted" &&
        gaId &&
        process.env.NODE_ENV === "production" && (
          <>
            <Script src={`/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gaId}');
                    `}</Script>
          </>
        )}

      {consent === "none" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
          <div className="max-w-2xl mx-auto bg-neutral-900 text-white rounded-xl shadow-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-neutral-300 flex-1 leading-relaxed">
              Wir verwenden Cookies für die Webanalyse (Google Analytics), um
              unsere Website zu verbessern.{" "}
              <Link
                href="/datenschutz"
                className="underline underline-offset-2 hover:text-white transition-colors"
              >
                Datenschutz
              </Link>
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
