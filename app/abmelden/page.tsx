import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { hasPermission, getRole } from "@/utils/permissions";
import { getSiteData } from "@/utils/site-data";
import { DAY_INDEX } from "@/utils/session-groups";
import {
    localIso,
    nextTrainingDate,
    nextTrainingDates,
    zurichToday,
} from "@/utils/school-holidays";
import {
    ABSENCE_REASONS,
    getActiveAbsencesForUser,
    isAbsentOn,
} from "@/utils/absences";
import { addAbsenceAction, deleteAbsenceAction } from "./absence-actions";

const formatDay = (d: Date) =>
    d.toLocaleDateString("de-CH", {
        weekday: "short",
        day: "numeric",
        month: "long",
    });

const formatIso = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString("de-CH", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Zurich",
    });
import {
    getTrainingSnapshot,
    anmeldenFuerTraining,
    abmeldenVonTraining,
} from "@/utils/trainings";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/axiom/action";

export default async function AbmeldenPage() {
    const { userId } = await auth();
    if (!userId) redirect("/login");

    const user = await currentUser();
    const role = getRole(user?.publicMetadata as Record<string, unknown>);
    if (!hasPermission(role, "mitglieder:access")) redirect("/login");

    const { training } = await getSiteData();
    const absences = await getActiveAbsencesForUser(userId);
    const today = zurichToday();

    // The next 10 real trainings across all sessions (holidays are skipped).
    const upcoming = training.sessions
        .flatMap((s) =>
            nextTrainingDates(DAY_INDEX[s.day] ?? 0, 10).map((date) => ({
                session: s,
                date,
                absence: isAbsentOn(absences, localIso(date)),
            })),
        )
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 10);

    const sessionData = await Promise.all(
        training.sessions.map(async (s) => {
            const snap = await getTrainingSnapshot(s.id, s.day);
            return {
                sessionId: s.id,
                angemeldet: snap.participants.includes(userId),
            };
        }),
    );

    async function handleAnmelden(formData: FormData) {
        "use server";

        const trainingId = formData.get("trainingId") as string;
        if (!trainingId || !userId) return;

        await logAction("handleAnmelden", { trainingId, userId }, async () => {
            await anmeldenFuerTraining(trainingId, userId);
            revalidatePath("/abmelden");
        });
    }

    async function handleAbmelden(formData: FormData) {
        "use server";

        const trainingId = formData.get("trainingId") as string;
        if (!trainingId || !userId) return;

        await logAction("handleAbmelden", { trainingId, userId }, async () => {
            await abmeldenVonTraining(trainingId, userId);
            revalidatePath("/abmelden");
        });
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navigation />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-10 space-y-6">
                <div>
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                        Training
                    </h1>
                    <p className="text-neutral-500 mt-1 text-sm">
                        Melde dich für Trainings an oder ab.
                    </p>
                </div>

                <div className="space-y-3">
                    {training.sessions.map((s, i) => {
                        const angemeldet = sessionData[i]?.angemeldet ?? false;
                        return (
                            <div
                                key={s.id}
                                className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between gap-4"
                            >
                                <div>
                                    <p className="font-bold text-neutral-900">
                                        {s.day}
                                    </p>
                                    <p className="text-sm text-neutral-500 mt-0.5">
                                        {s.time}
                                        {s.level && (
                                            <span className="ml-2 text-xs text-neutral-400">
                                                · {s.level}
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-neutral-400 mt-0.5">
                                        Nächstes Training:{" "}
                                        {nextTrainingDate(
                                            DAY_INDEX[s.day] ?? 0,
                                        ).toLocaleDateString("de-CH", {
                                            day: "numeric",
                                            month: "long",
                                            timeZone: "Europe/Zurich",
                                        })}
                                    </p>
                                </div>
                                {angemeldet ? (
                                    <form action={handleAbmelden}>
                                        <input
                                            type="hidden"
                                            name="trainingId"
                                            value={s.id}
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-md hover:bg-red-100 transition-colors"
                                        >
                                            Abmelden
                                        </button>
                                    </form>
                                ) : (
                                    <form action={handleAnmelden}>
                                        <input
                                            type="hidden"
                                            name="trainingId"
                                            value={s.id}
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 transition-colors"
                                        >
                                            Anmelden
                                        </button>
                                    </form>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Upcoming trainings */}
                <section className="bg-white rounded-xl border border-neutral-200 p-5">
                    <h2 className="font-bold text-neutral-900">
                        Kommende Trainings
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5 mb-3">
                        Ferien und schulfreie Tage sind nicht aufgeführt.
                    </p>
                    <ul className="divide-y divide-neutral-100">
                        {upcoming.map(({ session: s, date, absence }) => (
                            <li
                                key={`${s.id}-${date.getTime()}`}
                                className="py-2.5 flex items-center justify-between gap-3"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-neutral-900">
                                        {formatDay(date)}
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        {s.time}
                                        {s.level ? ` · ${s.level}` : ""}
                                    </p>
                                </div>
                                {absence && (
                                    <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                                        Abwesend · {absence.reason}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Longer absence */}
                <section className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <div>
                        <h2 className="font-bold text-neutral-900">
                            Längere Absenz eintragen
                        </h2>
                        <p className="text-xs text-neutral-400 mt-0.5">
                            z. B. bei Verletzung oder Krankheit. Du wirst für
                            alle Trainings in dieser Zeit automatisch
                            abgemeldet. Die Trainer sehen deine Absenz.
                        </p>
                    </div>

                    <form action={addAbsenceAction} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="text-xs font-semibold text-neutral-500 space-y-1">
                                Von
                                <input
                                    type="date"
                                    name="from"
                                    required
                                    min={today}
                                    defaultValue={today}
                                    className="block w-full px-3 py-2 border border-neutral-200 rounded-md text-sm font-normal text-neutral-900"
                                />
                            </label>
                            <label className="text-xs font-semibold text-neutral-500 space-y-1">
                                Bis (leer = bis auf Weiteres)
                                <input
                                    type="date"
                                    name="to"
                                    min={today}
                                    className="block w-full px-3 py-2 border border-neutral-200 rounded-md text-sm font-normal text-neutral-900"
                                />
                            </label>
                        </div>
                        <label className="block text-xs font-semibold text-neutral-500 space-y-1">
                            Grund
                            <select
                                name="reason"
                                required
                                defaultValue="Verletzung"
                                className="block w-full px-3 py-2 border border-neutral-200 rounded-md text-sm font-normal text-neutral-900 bg-white"
                            >
                                {ABSENCE_REASONS.map((r) => (
                                    <option key={r}>{r}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-xs font-semibold text-neutral-500 space-y-1">
                            Notiz (optional)
                            <textarea
                                name="note"
                                maxLength={300}
                                rows={2}
                                placeholder="z. B. Knöchel verstaucht, wieder dabei ab …"
                                className="block w-full px-3 py-2 border border-neutral-200 rounded-md text-sm font-normal text-neutral-900"
                            />
                        </label>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 transition-colors"
                        >
                            Absenz speichern
                        </button>
                    </form>

                    {absences.length > 0 && (
                        <div className="pt-4 border-t border-neutral-100">
                            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                Deine Absenzen
                            </p>
                            <ul className="space-y-2">
                                {absences.map((a) => (
                                    <li
                                        key={a.id}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900">
                                                {a.reason}:{" "}
                                                {formatIso(a.from)}
                                                {a.to
                                                    ? ` – ${formatIso(a.to)}`
                                                    : " – bis auf Weiteres"}
                                            </p>
                                            {a.note && (
                                                <p className="text-xs text-neutral-400 truncate">
                                                    {a.note}
                                                </p>
                                            )}
                                        </div>
                                        <form action={deleteAbsenceAction}>
                                            <input
                                                type="hidden"
                                                name="absenceId"
                                                value={a.id}
                                            />
                                            <button
                                                type="submit"
                                                className="shrink-0 text-xs font-semibold text-neutral-500 border border-neutral-200 rounded-md px-3 py-1.5 hover:border-neutral-400 transition-colors"
                                            >
                                                Wieder dabei
                                            </button>
                                        </form>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
