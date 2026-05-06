/**
 * Shared UI primitives used by all dashboard edit section components.
 *
 * Exports:
 *   DAYS        - ordered list of German weekday names for session dropdowns
 *   inputCls    - Tailwind class string for text inputs
 *   textareaCls - inputCls extended for textarea elements
 *   SectionCard - white card wrapper with icon + title header
 *   SaveButton  - submit button that shows a spinner, checkmark, or save icon
 *   Field       - labelled form field wrapper
 */

"use client";

import { Check, Save } from "lucide-react";

export const DAYS = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
];

export const inputCls =
    "w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white";

export const textareaCls = `${inputCls} resize-none`;

export function SectionCard({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Icon className="w-4 h-4 text-neutral-400" />
                <h2 className="font-bold text-neutral-900">{title}</h2>
            </div>
            {children}
        </div>
    );
}

export function SaveButton({ pending, saved }: { pending: boolean; saved: boolean }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
            {pending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
                <Check className="w-4 h-4" />
            ) : (
                <Save className="w-4 h-4" />
            )}
            {pending ? "Speichern…" : saved ? "Gespeichert" : "Speichern"}
        </button>
    );
}

export function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {label}
            </label>
            {children}
        </div>
    );
}
