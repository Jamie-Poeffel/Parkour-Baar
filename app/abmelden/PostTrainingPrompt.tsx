"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@/utils/site-data";
import { buildGroups, DAY_INDEX } from "@/utils/session-groups";
import type { Group } from "@/utils/session-groups";
import { abmeldenAction } from "./actions";

type Props = {
    sessions: Session[];
    userId: string;
    /** Session IDs the server considers the user registered for (fresh per render). */
    registeredSessionIds: string[];
};

function thisWeekOccurrence(dayName: string): Date | null {
    const target = DAY_INDEX[dayName];
    if (target === undefined) return null;
    const now = new Date();
    const diff = now.getDay() - target;
    if (diff < 0) return null;
    const d = new Date(now);
    d.setDate(now.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function groupOccurrence(group: Group): Date | null {
    const occs = group.sessions
        .map((s) => thisWeekOccurrence(s.day))
        .filter(Boolean) as Date[];
    if (occs.length === 0) return null;
    return occs.reduce((min, d) => (d < min ? d : min));
}

function dismissalKey(group: Group, occ: Date) {
    const ids = group.sessions.map((s) => s.id).join("+");
    return `abmelden-prompt-${ids}-${occ.toISOString()}`;
}

function isDismissed(group: Group, occ: Date): boolean {
    try {
        return !!localStorage.getItem(dismissalKey(group, occ));
    } catch {
        // localStorage unavailable or corrupt — treat as not dismissed and clear
        try { localStorage.removeItem(dismissalKey(group, occ)); } catch { /* ignore */ }
        return false;
    }
}

function markDismissed(group: Group, occ: Date) {
    try {
        localStorage.setItem(dismissalKey(group, occ), "seen");
    } catch { /* ignore write errors */ }
}

export default function PostTrainingPrompt({ sessions, userId, registeredSessionIds }: Props) {
    const router = useRouter();
    const [state, setState] = useState<{ pending: Group[]; current: number } | null>(null);

    useEffect(() => {
        const groups = buildGroups(sessions);
        const pending = groups.filter((g) => {
            // Training must have already happened this week
            const occ = groupOccurrence(g);
            if (!occ) return false;

            // Server says user is not registered → nothing to prompt about
            const isRegistered = g.sessions.some((s) =>
                registeredSessionIds.includes(s.id),
            );
            if (!isRegistered) return false;

            // User already dismissed this prompt this week
            return !isDismissed(g, occ);
        });
        setState(pending.length > 0 ? { pending, current: 0 } : null);
    }, [sessions, userId, registeredSessionIds]);

    if (!state) return null;

    const group = state.pending[state.current];
    const total = state.pending.length;
    const isLast = state.current + 1 >= total;

    function advance(didAbmelden: boolean) {
        if (!isLast) {
            setState((prev) => prev && { ...prev, current: prev.current + 1 });
        } else {
            setState(null);
            // Only refresh the server component when something actually changed
            if (didAbmelden) router.refresh();
        }
    }

    function close() {
        const occ = groupOccurrence(group);
        if (occ) markDismissed(group, occ);
        advance(false);
    }

    async function abmelden() {
        const occ = groupOccurrence(group);
        if (occ) markDismissed(group, occ);
        for (const session of group.sessions) {
            await abmeldenAction(session.id, userId);
        }
        advance(true);
    }

    const days = [...new Set(group.sessions.map((s) => s.day))];
    const title = days.join(" + ");

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-50">
            <button
                onClick={close}
                aria-label="Schliessen"
                className="absolute top-5 left-5 flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200 hover:bg-neutral-300 transition-colors text-neutral-700"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {total > 1 && (
                <p className="absolute top-6 right-6 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                    {state.current + 1} / {total}
                </p>
            )}

            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight leading-tight">
                    {days.length > 1 ? <br /> : <> </>}
                    {title}
                </h1>
                <p className="text-neutral-500 text-base max-w-xs leading-relaxed mt-2">
                    Möchtest du dich für nächste Woche abmelden?
                </p>
            </div>

            <div className="px-6 pb-10 flex flex-col gap-2">
                <button
                    onClick={abmelden}
                    className="w-full py-4 bg-neutral-900 border border-neutral-900 text-white text-base font-bold rounded-xl hover:bg-neutral-700 transition-colors"
                >
                    Abmelden
                </button>
                <button
                    onClick={close}
                    className="w-full py-4 border border-neutral-900 text-black text-base font-bold rounded-xl hover:bg-neutral-100 transition-colors"
                >
                    Schliessen
                </button>
            </div>
        </div>
    );
}
