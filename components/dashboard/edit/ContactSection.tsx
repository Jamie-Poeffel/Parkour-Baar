/**
 * ContactSection — admin panel section for managing contact info and social links.
 *
 * Allows editing the club email address and maintaining a list of social media
 * links (label + URL pairs, e.g. "Instagram → https://instagram.com/...").
 *
 * Persistence is handled via updateEmail, upsertSocial, deleteSocial server
 * actions from @/app/actions.
 */

"use client";

import { useState, useTransition } from "react";
import { AtSign, Plus, Trash2, Save, Check } from "lucide-react";
import {
    updateEmail,
    upsertSocial,
    deleteSocial,
} from "@/app/actions";
import type { Social, SiteData } from "@/utils/site-data";
import { SectionCard, Field, inputCls } from "./shared";

export function ContactSection({ initial }: { initial: SiteData["contact"] }) {
    const [email, setEmail] = useState(initial.email);
    const [socials, setSocials] = useState<Social[]>(initial.socials);
    const [editing, setEditing] = useState<Social | null>(null);
    const [isPending, startTransition] = useTransition();
    const [emailSaved, setEmailSaved] = useState(false);
    const [savedId, setSavedId] = useState<string | null>(null);

    function saveEmail() {
        startTransition(async () => {
            await updateEmail(email);
            setEmailSaved(true);
            setTimeout(() => setEmailSaved(false), 2000);
        });
    }

    function saveSocial(s: Social) {
        startTransition(async () => {
            await upsertSocial(s);
            setSocials((prev) => {
                const idx = prev.findIndex((x) => x.id === s.id);
                return idx >= 0
                    ? prev.map((x) => (x.id === s.id ? s : x))
                    : [...prev, s];
            });
            setSavedId(s.id);
            setEditing(null);
            setTimeout(() => setSavedId(null), 2000);
        });
    }

    function removeSocial(id: string) {
        if (!confirm("Social Link löschen?")) return;
        startTransition(async () => {
            await deleteSocial(id);
            setSocials((prev) => prev.filter((s) => s.id !== id));
        });
    }

    const blankSocial = (): Social => ({
        id: Date.now().toString(),
        label: "",
        url: "",
    });

    return (
        <SectionCard title="Kontakt & Social" icon={AtSign}>
            {/* Email */}
            <div className="mb-6 pb-6 border-b border-neutral-100">
                <Field label="E-Mail">
                    <div className="flex gap-2">
                        <input
                            className={inputCls}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            onClick={saveEmail}
                            disabled={isPending}
                            className="flex items-center gap-1.5 px-3 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors shrink-0"
                        >
                            {emailSaved ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </Field>
            </div>

            {/* Socials list */}
            <div className="space-y-2 mb-4">
                {socials.map((s) => (
                    <div key={s.id} className="border border-neutral-200 rounded-lg">
                        {editing?.id === s.id ? (
                            <SocialForm
                                social={editing}
                                onChange={setEditing}
                                onSave={() => saveSocial(editing)}
                                onCancel={() => setEditing(null)}
                                isPending={isPending}
                            />
                        ) : (
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    {savedId === s.id && (
                                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                                    )}
                                    <span className="font-semibold text-sm text-neutral-900 w-24 shrink-0">
                                        {s.label}
                                    </span>
                                    <span className="text-sm text-neutral-400 truncate">
                                        {s.url}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                    <button
                                        onClick={() => setEditing({ ...s })}
                                        className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                                    >
                                        Bearbeiten
                                    </button>
                                    <button
                                        onClick={() => removeSocial(s.id)}
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

            {editing && !socials.find((s) => s.id === editing.id) ? (
                <div className="border border-neutral-200 rounded-lg">
                    <SocialForm
                        social={editing}
                        onChange={setEditing}
                        onSave={() => saveSocial(editing)}
                        onCancel={() => setEditing(null)}
                        isPending={isPending}
                    />
                </div>
            ) : (
                <button
                    onClick={() => setEditing(blankSocial())}
                    className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-neutral-300 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 rounded-lg text-sm font-medium w-full justify-center transition-colors"
                >
                    <Plus className="w-4 h-4" /> Social Link hinzufügen
                </button>
            )}
        </SectionCard>
    );
}

function SocialForm({
    social,
    onChange,
    onSave,
    onCancel,
    isPending,
}: {
    social: Social;
    onChange: (s: Social) => void;
    onSave: () => void;
    onCancel: () => void;
    isPending: boolean;
}) {
    return (
        <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <Field label="Name (z.B. Instagram)">
                    <input
                        className={inputCls}
                        placeholder="Instagram"
                        value={social.label}
                        onChange={(e) => onChange({ ...social, label: e.target.value })}
                    />
                </Field>
                <Field label="URL">
                    <input
                        className={inputCls}
                        placeholder="https://..."
                        value={social.url}
                        onChange={(e) => onChange({ ...social, url: e.target.value })}
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
                    disabled={isPending || !social.label || !social.url}
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
