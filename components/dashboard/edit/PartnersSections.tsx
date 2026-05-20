"use client";

import { useState, useTransition } from "react";
import { HandshakeIcon, Plus, Trash2, Save, Check } from "lucide-react";
import { upsertPartner, deletePartner } from "@/app/actions";
import type { Partner } from "@/utils/site-data";
import { SectionCard, Field, inputCls } from "./shared";
import { trackEvent, captureException } from "@/components/LogRocket";

export function PartnersSection({ initial = [] }: { initial?: Partner[] }) {
    const [partners, setPartners] = useState<Partner[]>(initial);
    const [editing, setEditing] = useState<Partner | null>(null);
    const [isPending, startTransition] = useTransition();
    const [savedId, setSavedId] = useState<string | null>(null);

    const blank = (): Partner => ({
        id: Date.now().toString(),
        name: "",
        logoUrl: "",
        websiteUrl: "",
    });

    function save(p: Partner) {
        startTransition(async () => {
            try {
                await upsertPartner(p);
                trackEvent("partner_saved");
                setPartners((prev) => {
                    const idx = prev.findIndex((x) => x.id === p.id);
                    return idx >= 0
                        ? prev.map((x) => (x.id === p.id ? p : x))
                        : [...prev, p];
                });
                setSavedId(p.id);
                setEditing(null);
                setTimeout(() => setSavedId(null), 2000);
            } catch (err) {
                captureException(err instanceof Error ? err : new Error(String(err)));
            }
        });
    }

    function remove(id: string) {
        if (!confirm("Partner löschen?")) return;
        startTransition(async () => {
            try {
                await deletePartner(id);
                trackEvent("partner_deleted");
                setPartners((prev) => prev.filter((p) => p.id !== id));
            } catch (err) {
                captureException(err instanceof Error ? err : new Error(String(err)));
            }
        });
    }

    return (
        <SectionCard title="Partner" icon={HandshakeIcon}>
            {/* Partner list */}
            <div className="space-y-3 mb-4">
                {partners.length === 0 && !editing && (
                    <p className="text-sm text-neutral-500">
                        Noch keine Partner hinzugefügt.
                    </p>
                )}

                {partners.map((p) => (
                    <div
                        key={p.id}
                        className="border border-neutral-200 rounded-lg"
                    >
                        {editing?.id === p.id ? (
                            <PartnerForm
                                partner={editing}
                                onChange={setEditing}
                                onSave={() => save(editing)}
                                onCancel={() => setEditing(null)}
                                isPending={isPending}
                            />
                        ) : (
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center gap-4 text-sm flex-wrap">
                                    {/* Logo preview */}
                                    {p.logoUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={p.logoUrl}
                                            alt={p.name}
                                            className="h-7 w-auto object-contain rounded"
                                        />
                                    ) : (
                                        <div className="h-7 w-7 bg-neutral-100 rounded flex items-center justify-center">
                                            <HandshakeIcon className="w-3.5 h-3.5 text-neutral-400" />
                                        </div>
                                    )}

                                    <span className="font-semibold text-neutral-900">
                                        {p.name}
                                    </span>

                                    {p.websiteUrl && (
                                        <a
                                            href={p.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-neutral-400 text-xs hover:text-neutral-600 transition-colors hidden sm:block truncate max-w-50"
                                        >
                                            {p.websiteUrl}
                                        </a>
                                    )}
                                </div>

                                <div className="flex items-center gap-1">
                                    {savedId === p.id && (
                                        <Check className="w-4 h-4 text-green-500 mr-1" />
                                    )}
                                    <button
                                        onClick={() => setEditing({ ...p })}
                                        className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                                    >
                                        Bearbeiten
                                    </button>
                                    <button
                                        onClick={() => remove(p.id)}
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

            {/* New partner form (not yet in list) */}
            {editing && !partners.find((p) => p.id === editing.id) ? (
                <div className="border border-neutral-200 rounded-lg">
                    <PartnerForm
                        partner={editing}
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
                    <Plus className="w-4 h-4" /> Partner hinzufügen
                </button>
            ) : null}
        </SectionCard>
    );
}

function PartnerForm({
    partner,
    onChange,
    onSave,
    onCancel,
    isPending,
}: {
    partner: Partner;
    onChange: (p: Partner) => void;
    onSave: () => void;
    onCancel: () => void;
    isPending: boolean;
}) {
    return (
        <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Name">
                    <input
                        className={inputCls}
                        placeholder="Acme AG"
                        value={partner.name}
                        onChange={(e) =>
                            onChange({ ...partner, name: e.target.value })
                        }
                    />
                </Field>
                <Field label="Website URL">
                    <input
                        className={inputCls}
                        placeholder="https://example.com"
                        value={partner.websiteUrl}
                        onChange={(e) =>
                            onChange({ ...partner, websiteUrl: e.target.value })
                        }
                    />
                </Field>
                <Field label="Logo URL" className="sm:col-span-2">
                    <input
                        className={inputCls}
                        placeholder="https://example.com/logo.png"
                        value={partner.logoUrl}
                        onChange={(e) =>
                            onChange({ ...partner, logoUrl: e.target.value })
                        }
                    />
                </Field>

                {/* Live logo preview */}
                {partner.logoUrl && (
                    <div className="sm:col-span-2 flex items-center gap-3">
                        <span className="text-xs text-neutral-400">
                            Vorschau:
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={partner.logoUrl}
                            alt="Logo-Vorschau"
                            className="h-8 w-auto object-contain rounded border border-neutral-100"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                    "none";
                            }}
                        />
                    </div>
                )}
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
                    disabled={isPending || !partner.name.trim()}
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
