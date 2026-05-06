"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/utils/site-data";
import { buildGroups, DAY_INDEX } from "@/utils/session-groups";
import type { Group } from "@/utils/session-groups";

type Props = {
    sessions: Session[];
    userId: string;
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
    // earliest session in the group that has already occurred this week
    const occs = group.sessions.map((s) => thisWeekOccurrence(s.day)).filter(Boolean) as Date[];
    if (occs.length === 0) return null;
    return occs.reduce((min, d) => (d < min ? d : min));
}

function storageKey(group: Group, occ: Date) {
    const key = group.sessions.map((s) => s.id).join("+");
    return `abmelden-prompt-${key}-${occ.toISOString()}`;
}

export default function PostTrainingPrompt({ sessions, userId }: Props) {
    const [state, setState] = useState<{ pending: Group[]; current: number } | null>(null);

    useEffect(() => {
        const isDev = process.env.NODE_ENV === "development";
        const groups = buildGroups(sessions);
        const pending = groups.filter((g) => {
            const occ = groupOccurrence(g);
            if (!occ) return false;
            return isDev || !localStorage.getItem(storageKey(g, occ));
        });
        setState(pending.length > 0 ? { pending, current: 0 } : null);
    }, [sessions, userId]);

    function dismiss() {
        if (!state) return;
        const g = state.pending[state.current];
        const occ = groupOccurrence(g);
        if (occ) localStorage.setItem(storageKey(g, occ), "seen");
        if (state.current + 1 < state.pending.length) {
            setState((prev) => prev && { ...prev, current: prev.current + 1 });
        } else {
            setState(null);
        }
    }

    if (!state) return null;

    const group = state.pending[state.current];
    const total = state.pending.length;
    const title = group.sessions.map((s) => s.day).join(" + ");
    const subtitle = group.sessions.map((s) => `${s.time}${s.level ? ` · ${s.level}` : ""}`).join("  |  ");

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-50">
            <button
                onClick={dismiss}
                aria-label="Schliessen"
                className="absolute top-5 left-5 flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200 hover:bg-neutral-300 transition-colors text-neutral-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">
                    {subtitle}
                </p>
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight leading-tight">
                    Training<br />{title}
                </h1>
                <p className="text-neutral-500 text-base max-w-xs leading-relaxed mt-2">
                    Das Training hat diese Woche stattgefunden. Möchtest du dich für nächste Woche abmelden?
                </p>
            </div>

            <div className="px-6 pb-10">
                <button
                    onClick={dismiss}
                    className="w-full py-4 bg-neutral-900 text-white text-base font-bold rounded-xl hover:bg-neutral-700 transition-colors"
                >
                    Abmelden
                </button>
            </div>
        </div>
    );
}
