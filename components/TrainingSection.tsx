"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Clock } from "lucide-react";
import type { Session } from "@/lib/site-data";

type SessionStatus = { sessionId: string; angemeldet: boolean };

type Props = {
    sessions: Session[];
    sessionData: SessionStatus[];
    location: string;
    onAnmelden: (trainingId: string) => Promise<void>;
    onAbmelden: (trainingId: string) => Promise<void>;
    onAnmeldenAll: (trainingIds: string[]) => Promise<void>;
    onAbmeldenAll: (trainingIds: string[]) => Promise<void>;
};

type Group = { sessions: Session[]; linked: boolean };

function buildGroups(sessions: Session[]): Group[] {
    const visited = new Set<string>();
    const groups: Group[] = [];

    for (const s of sessions) {
        if (visited.has(s.id)) continue;
        visited.add(s.id);

        if (s.linkedTo) {
            const linked = sessions.find((x) => x.id === s.linkedTo);
            if (linked && !visited.has(linked.id)) {
                visited.add(linked.id);
                groups.push({ sessions: [s, linked], linked: true });
                continue;
            }
        }

        // Check if another session links to this one
        const linksToThis = sessions.find(
            (x) => x.linkedTo === s.id && !visited.has(x.id),
        );
        if (linksToThis) {
            visited.add(linksToThis.id);
            groups.push({ sessions: [s, linksToThis], linked: true });
            continue;
        }

        groups.push({ sessions: [s], linked: false });
    }

    return groups;
}

function StatusBadge({ angemeldet }: { angemeldet: boolean }) {
    return (
        <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                angemeldet
                    ? "bg-green-50 text-green-700"
                    : "bg-neutral-100 text-neutral-400"
            }`}
        >
            {angemeldet ? "Angemeldet" : "Abgemeldet"}
        </span>
    );
}

export function TrainingSection({
    sessions,
    sessionData,
    location,
    onAnmelden,
    onAbmelden,
    onAnmeldenAll,
    onAbmeldenAll,
}: Props) {
    const groups = buildGroups(sessions);
    const statusMap = Object.fromEntries(
        sessionData.map((d) => [d.sessionId, d.angemeldet]),
    );
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [pending, setPending] = useState<Set<string>>(new Set());

    function toggleExpanded(key: string) {
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    }

    async function act(key: string, fn: () => Promise<void>) {
        setPending((p) => new Set(p).add(key));
        await fn();
        setPending((p) => {
            const next = new Set(p);
            next.delete(key);
            return next;
        });
    }

    return (
        <div className="bg-white rounded-xl border border-neutral-200">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-neutral-100">
                <Clock className="w-4 h-4 text-neutral-400" />
                <h2 className="font-bold text-neutral-900">Training</h2>
            </div>

            <div className="divide-y divide-neutral-100">
                {sessions.length === 0 && (
                    <p className="px-6 py-4 text-sm text-neutral-400">
                        Keine Trainings eingetragen.
                    </p>
                )}

                {groups.map((group) => {
                    const groupKey = group.sessions.map((s) => s.id).join("+");
                    const isExpanded = expanded.has(groupKey);
                    const isPending = pending.has(groupKey);
                    const allAngemeldet = group.sessions.every(
                        (s) => statusMap[s.id],
                    );
                    const anyAngemeldet = group.sessions.some(
                        (s) => statusMap[s.id],
                    );

                    if (!group.linked) {
                        const s = group.sessions[0];
                        const angemeldet = statusMap[s.id] ?? false;
                        return (
                            <div
                                key={s.id}
                                className="flex items-center justify-between px-6 py-4 gap-4"
                            >
                                <div>
                                    <p className="font-semibold text-neutral-900">{s.day}</p>
                                    <p className="text-sm text-neutral-500 mt-0.5">
                                        {s.time}
                                        {s.level && (
                                            <span className="ml-2 text-xs text-neutral-400">
                                                · {s.level}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <StatusBadge angemeldet={angemeldet} />
                                    <button
                                        disabled={isPending}
                                        onClick={() =>
                                            act(s.id, () =>
                                                angemeldet
                                                    ? onAbmelden(s.id)
                                                    : onAnmelden(s.id),
                                            )
                                        }
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 ${
                                            angemeldet
                                                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                                : "bg-neutral-900 text-white hover:bg-neutral-700"
                                        }`}
                                    >
                                        {angemeldet ? "Abmelden" : "Anmelden"}
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    // Linked group
                    return (
                        <div key={groupKey}>
                            {/* Group header row */}
                            <div className="flex items-center justify-between px-6 py-4 gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {group.sessions.map((s, i) => (
                                            <span key={s.id} className="flex items-center gap-1">
                                                {i > 0 && (
                                                    <span className="text-neutral-300 text-xs">+</span>
                                                )}
                                                <span className="font-semibold text-neutral-900 text-sm">
                                                    {s.day}
                                                </span>
                                                <span className="text-xs text-neutral-400">
                                                    {s.time}
                                                    {s.level ? ` · ${s.level}` : ""}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-neutral-400 mt-0.5">
                                        Verknüpfte Trainings
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <StatusBadge angemeldet={allAngemeldet} />
                                    <button
                                        disabled={isPending}
                                        onClick={() =>
                                            act(groupKey, () => {
                                                const ids = group.sessions.map((s) => s.id);
                                                return anyAngemeldet
                                                    ? onAbmeldenAll(ids)
                                                    : onAnmeldenAll(ids);
                                            })
                                        }
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 ${
                                            anyAngemeldet
                                                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                                : "bg-neutral-900 text-white hover:bg-neutral-700"
                                        }`}
                                    >
                                        {anyAngemeldet ? "Alle abmelden" : "Alle anmelden"}
                                    </button>
                                    <button
                                        onClick={() => toggleExpanded(groupKey)}
                                        className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                                        aria-label="Details anzeigen"
                                    >
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded individual rows */}
                            {isExpanded && (
                                <div className="border-t border-neutral-100 bg-neutral-50 divide-y divide-neutral-100">
                                    {group.sessions.map((s) => {
                                        const angemeldet = statusMap[s.id] ?? false;
                                        const rowKey = `${groupKey}-${s.id}`;
                                        return (
                                            <div
                                                key={s.id}
                                                className="flex items-center justify-between px-8 py-3 gap-4"
                                            >
                                                <div>
                                                    <p className="font-medium text-sm text-neutral-800">
                                                        {s.day}
                                                    </p>
                                                    <p className="text-xs text-neutral-400 mt-0.5">
                                                        {s.time}
                                                        {s.level && ` · ${s.level}`}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <StatusBadge angemeldet={angemeldet} />
                                                    <button
                                                        disabled={pending.has(rowKey)}
                                                        onClick={() =>
                                                            act(rowKey, () =>
                                                                angemeldet
                                                                    ? onAbmelden(s.id)
                                                                    : onAnmelden(s.id),
                                                            )
                                                        }
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 ${
                                                            angemeldet
                                                                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                                                : "bg-neutral-900 text-white hover:bg-neutral-700"
                                                        }`}
                                                    >
                                                        {angemeldet ? "Abmelden" : "Anmelden"}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="px-6 py-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs text-neutral-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {location}
            </div>
        </div>
    );
}
