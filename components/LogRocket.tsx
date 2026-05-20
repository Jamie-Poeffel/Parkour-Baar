"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import LogRocket from "logrocket";

let initialized = false;

function init() {
    if (initialized) return;
    const appId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID;
    if (!appId) return;
    LogRocket.init(appId);
    initialized = true;
}

export function trackEvent(name: string) {
    init();
    LogRocket.track(name);
}

export function captureException(err: Error) {
    init();
    LogRocket.captureException(err);
}

export function LogRocketInit() {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (!isLoaded || !initialized) return;
        if (user) {
            LogRocket.identify(user.id, {
                name: user.fullName ?? "",
                email: user.primaryEmailAddress?.emailAddress ?? "",
            });
        }
    }, [isLoaded, user]);

    return null;
}
