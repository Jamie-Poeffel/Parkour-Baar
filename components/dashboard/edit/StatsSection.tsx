/**
 * StatsSection — admin panel section for editing site statistics.
 *
 * Displays editable fields for members, years active, and coaches.
 * The "sessions per week" stat is read-only because it is derived
 * automatically from the number of sessions in the training schedule.
 *
 * Persistence is handled via the updateStats server action from @/app/actions.
 */

"use client";

import { useState, useTransition } from "react";
import { BarChart2 } from "lucide-react";
import { updateStats } from "@/app/actions";
import type { SiteData } from "@/utils/site-data";
import { SectionCard, SaveButton, Field, inputCls } from "./shared";

export function StatsSection({
    initial,
    sessionsCount,
}: {
    initial: SiteData["stats"];
    sessionsCount: number;
}) {
    const [stats, setStats] = useState(initial);
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            await updateStats(stats);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        });
    }

    return (
        <SectionCard title="Statistiken" icon={BarChart2}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {(["members", "years", "coaches"] as const).map((key) => (
                        <Field
                            key={key}
                            label={
                                { members: "Mitglieder", years: "Jahre aktiv", coaches: "Coaches" }[key]
                            }
                        >
                            <input
                                className={inputCls}
                                value={stats[key]}
                                onChange={(e) => setStats({ ...stats, [key]: e.target.value })}
                            />
                        </Field>
                    ))}
                    <Field label="Trainings/Woche">
                        <div
                            className={`${inputCls} bg-neutral-50 text-neutral-500 cursor-default flex items-center gap-2`}
                        >
                            {sessionsCount}
                            <span className="text-xs text-neutral-400">(automatisch)</span>
                        </div>
                    </Field>
                </div>
                <div className="flex justify-end">
                    <SaveButton pending={isPending} saved={saved} />
                </div>
            </form>
        </SectionCard>
    );
}
