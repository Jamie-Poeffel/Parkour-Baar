/**
 * AboutSection — admin panel section for editing the "Über uns" page text.
 *
 * Contains two free-text paragraphs shown on the public home page.
 * Persistence is handled via the updateAbout server action from @/app/actions.
 */

"use client";

import { useState, useTransition } from "react";
import { Users } from "lucide-react";
import { updateAbout } from "@/app/actions";
import type { SiteData } from "@/utils/site-data";
import { SectionCard, SaveButton, Field, textareaCls } from "./shared";

export function AboutSection({ initial }: { initial: SiteData["about"] }) {
    const [about, setAbout] = useState(initial);
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            await updateAbout(about.text1, about.text2);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        });
    }

    return (
        <SectionCard title="Über uns" icon={Users}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Absatz 1">
                    <textarea
                        className={textareaCls}
                        rows={3}
                        value={about.text1}
                        onChange={(e) => setAbout({ ...about, text1: e.target.value })}
                    />
                </Field>
                <Field label="Absatz 2">
                    <textarea
                        className={textareaCls}
                        rows={2}
                        value={about.text2}
                        onChange={(e) => setAbout({ ...about, text2: e.target.value })}
                    />
                </Field>
                <div className="flex justify-end">
                    <SaveButton pending={isPending} saved={saved} />
                </div>
            </form>
        </SectionCard>
    );
}
