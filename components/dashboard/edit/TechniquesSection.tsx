/**
 * TechniquesSection — admin panel section for managing the "Was du lernst" list.
 *
 * Each technique has a name (e.g. "Kong Vault") and a short description.
 * The list is shown on the public training page as a curriculum overview.
 *
 * Persistence is handled via upsertTechnique, deleteTechnique server actions
 * from @/app/actions.
 */

"use client";

import { useState, useTransition } from "react";
import { BookOpen, Plus, Trash2, Save, Check } from "lucide-react";
import { upsertTechnique, deleteTechnique } from "@/app/actions";
import type { Technique } from "@/utils/site-data";
import { SectionCard, Field, inputCls } from "./shared";

export function TechniquesSection({ initial }: { initial: Technique[] }) {
    const [techniques, setTechniques] = useState<Technique[]>(initial);
    const [editing, setEditing] = useState<Technique | null>(null);
    const [isPending, startTransition] = useTransition();
    const [savedId, setSavedId] = useState<string | null>(null);

    function save(t: Technique) {
        startTransition(async () => {
            await upsertTechnique(t);
            setTechniques((prev) => {
                const idx = prev.findIndex((x) => x.id === t.id);
                return idx >= 0
                    ? prev.map((x) => (x.id === t.id ? t : x))
                    : [...prev, t];
            });
            setSavedId(t.id);
            setEditing(null);
            setTimeout(() => setSavedId(null), 2000);
        });
    }

    function remove(id: string) {
        if (!confirm("Technik löschen?")) return;
        startTransition(async () => {
            await deleteTechnique(id);
            setTechniques((prev) => prev.filter((t) => t.id !== id));
        });
    }

    const blank = (): Technique => ({
        id: Date.now().toString(),
        name: "",
        desc: "",
    });

    return (
        <SectionCard title="Was du lernst" icon={BookOpen}>
            <div className="space-y-2 mb-4">
                {techniques.map((t) => (
                    <div key={t.id} className="border border-neutral-200 rounded-lg">
                        {editing?.id === t.id ? (
                            <TechniqueForm
                                technique={editing}
                                onChange={setEditing}
                                onSave={() => save(editing)}
                                onCancel={() => setEditing(null)}
                                isPending={isPending}
                            />
                        ) : (
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center gap-4 min-w-0">
                                    {savedId === t.id && (
                                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    )}
                                    <span className="font-semibold text-sm text-neutral-900 w-32 shrink-0">
                                        {t.name}
                                    </span>
                                    <span className="text-sm text-neutral-400 truncate">
                                        {t.desc}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                    <button
                                        onClick={() => setEditing({ ...t })}
                                        className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                                    >
                                        Bearbeiten
                                    </button>
                                    <button
                                        onClick={() => remove(t.id)}
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

            {editing && !techniques.find((t) => t.id === editing.id) ? (
                <div className="border border-neutral-200 rounded-lg">
                    <TechniqueForm
                        technique={editing}
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
                    <Plus className="w-4 h-4" /> Technik hinzufügen
                </button>
            ) : null}
        </SectionCard>
    );
}

function TechniqueForm({
    technique,
    onChange,
    onSave,
    onCancel,
    isPending,
}: {
    technique: Technique;
    onChange: (t: Technique) => void;
    onSave: () => void;
    onCancel: () => void;
    isPending: boolean;
}) {
    return (
        <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <Field label="Name (z.B. Kong Vault)">
                    <input
                        className={inputCls}
                        placeholder="Kong Vault"
                        value={technique.name}
                        onChange={(e) => onChange({ ...technique, name: e.target.value })}
                    />
                </Field>
                <Field label="Beschreibung">
                    <input
                        className={inputCls}
                        placeholder="Hindernisse mit beiden Händen überwinden"
                        value={technique.desc}
                        onChange={(e) => onChange({ ...technique, desc: e.target.value })}
                    />
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
                    disabled={isPending || !technique.name}
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
