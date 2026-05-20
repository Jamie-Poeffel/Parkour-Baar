/**
 * SessionsSection — admin panel section for managing training sessions.
 *
 * Lets admins add, edit, and delete sessions and update the training location.
 * Each session has a day, time, level, optional note, and an optional link to
 * another session (used to group related sessions together on the member page).
 *
 * Persistence is handled via server actions (upsertSession, deleteSession,
 * updateLocation) from @/app/actions.
 */

"use client";

import { useState, useTransition } from "react";
import { Clock, Plus, Trash2, Save, Check } from "lucide-react";
import {
    updateLocation,
    upsertSession,
    deleteSession,
} from "@/app/actions";
import type { Session } from "@/utils/site-data";
import { SectionCard, Field, inputCls, DAYS } from "./shared";
import { trackEvent, captureException } from "@/components/LogRocket";

export function SessionsSection({
    initial,
    location: initLocation,
}: {
    initial: Session[];
    location: string;
}) {
    const [sessions, setSessions] = useState<Session[]>(initial);
    const [location, setLocation] = useState(initLocation);
    const [editing, setEditing] = useState<Session | null>(null);
    const [isPending, startTransition] = useTransition();
    const [savedId, setSavedId] = useState<string | null>(null);

    const blank = (): Session => ({
        id: Date.now().toString(),
        day: "Dienstag",
        time: "",
        level: "",
        note: "",
    });

    function save(s: Session) {
        startTransition(async () => {
            try {
                await upsertSession(s);
                trackEvent("session_saved");
                setSessions((prev) => {
                    const idx = prev.findIndex((x) => x.id === s.id);
                    return idx >= 0
                        ? prev.map((x) => (x.id === s.id ? s : x))
                        : [...prev, s];
                });
                setSavedId(s.id);
                setEditing(null);
                setTimeout(() => setSavedId(null), 2000);
            } catch (err) {
                captureException(err instanceof Error ? err : new Error(String(err)));
            }
        });
    }

    function remove(id: string) {
        if (!confirm("Training löschen?")) return;
        startTransition(async () => {
            try {
                await deleteSession(id);
                trackEvent("session_deleted");
                setSessions((prev) => prev.filter((s) => s.id !== id));
            } catch (err) {
                captureException(err instanceof Error ? err : new Error(String(err)));
            }
        });
    }

    function saveLocation() {
        startTransition(async () => {
            try {
                await updateLocation(location);
                trackEvent("location_saved");
                setSavedId("location");
                setTimeout(() => setSavedId(null), 2000);
            } catch (err) {
                captureException(err instanceof Error ? err : new Error(String(err)));
            }
        });
    }

    return (
        <SectionCard title="Trainingszeiten" icon={Clock}>
            {/* Location */}
            <div className="mb-6 pb-6 border-b border-neutral-100">
                <Field label="Trainingsort">
                    <div className="flex gap-2">
                        <input
                            className={inputCls}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <button
                            onClick={saveLocation}
                            disabled={isPending}
                            className="flex items-center gap-1.5 px-3 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors shrink-0"
                        >
                            {savedId === "location" ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </Field>
            </div>

            {/* Session list */}
            <div className="space-y-3 mb-4">
                {sessions.map((s) => (
                    <div key={s.id} className="border border-neutral-200 rounded-lg">
                        {editing?.id === s.id ? (
                            <SessionForm
                                session={editing}
                                allSessions={sessions}
                                onChange={setEditing}
                                onSave={() => save(editing)}
                                onCancel={() => setEditing(null)}
                                isPending={isPending}
                            />
                        ) : (
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center gap-4 text-sm flex-wrap">
                                    <span className="font-semibold text-neutral-900 w-24">
                                        {s.day}
                                    </span>
                                    <span className="text-neutral-600">{s.time}</span>
                                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                                        {s.level}
                                    </span>
                                    <span className="text-neutral-400 text-xs hidden sm:block">
                                        {s.note}
                                    </span>
                                    {s.linkedTo && (() => {
                                        const linked = sessions.find((x) => x.id === s.linkedTo);
                                        return linked ? (
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                                                ⟷ {linked.day} {linked.time}
                                            </span>
                                        ) : null;
                                    })()}
                                </div>
                                <div className="flex items-center gap-1">
                                    {savedId === s.id && (
                                        <Check className="w-4 h-4 text-green-500 mr-1" />
                                    )}
                                    <button
                                        onClick={() => setEditing({ ...s })}
                                        className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                                    >
                                        Bearbeiten
                                    </button>
                                    <button
                                        onClick={() => remove(s.id)}
                                        disabled={isPending}
                                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {editing && !sessions.find((s) => s.id === editing.id) ? (
                <div className="border border-neutral-200 rounded-lg">
                    <SessionForm
                        session={editing}
                        allSessions={sessions}
                        onChange={setEditing}
                        onSave={() => save(editing)}
                        onCancel={() => setEditing(null)}
                        isPending={isPending}
                    />
                </div>
            ) : !editing ? (
                <button
                    onClick={() => setEditing(blank())}
                    className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-neutral-300 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 rounded-lg text-sm font-medium w-full justify-center transition-colors"
                >
                    <Plus className="w-4 h-4" /> Training hinzufügen
                </button>
            ) : null}
        </SectionCard>
    );
}

function SessionForm({
    session,
    allSessions,
    onChange,
    onSave,
    onCancel,
    isPending,
}: {
    session: Session;
    allSessions: Session[];
    onChange: (s: Session) => void;
    onSave: () => void;
    onCancel: () => void;
    isPending: boolean;
}) {
    const others = allSessions.filter((s) => s.id !== session.id);
    return (
        <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Tag">
                    <select
                        className={inputCls}
                        value={session.day}
                        onChange={(e) => onChange({ ...session, day: e.target.value })}
                    >
                        {DAYS.map((d) => (
                            <option key={d}>{d}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Zeit">
                    <input
                        className={inputCls}
                        placeholder="18:00 – 20:00"
                        value={session.time}
                        onChange={(e) => onChange({ ...session, time: e.target.value })}
                    />
                </Field>
                <Field label="Level">
                    <input
                        className={inputCls}
                        placeholder="Anfänger"
                        value={session.level}
                        onChange={(e) => onChange({ ...session, level: e.target.value })}
                    />
                </Field>
                <Field label="Hinweis">
                    <input
                        className={inputCls}
                        placeholder="Max. 12 Teilnehmer"
                        value={session.note}
                        onChange={(e) => onChange({ ...session, note: e.target.value })}
                    />
                </Field>
                <Field label="Verknüpft mit">
                    <select
                        className={inputCls}
                        value={session.linkedTo ?? ""}
                        onChange={(e) =>
                            onChange({ ...session, linkedTo: e.target.value || undefined })
                        }
                    >
                        <option value="">– keine –</option>
                        {others.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.day} {s.time} {s.level ? `(${s.level})` : ""}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>
            <div className="flex justify-end gap-2 pt-1">
                <button
                    onClick={onCancel}
                    className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                    Abbrechen
                </button>
                <button
                    onClick={onSave}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                >
                    {isPending ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Speichern
                </button>
            </div>
        </div>
    );
}
