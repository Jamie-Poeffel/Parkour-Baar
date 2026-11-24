import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CalendarPlus, Mail, User } from "lucide-react";
import { SignOutBtn } from "@/components/SignOutBtn";
import { Navigation } from "@/components/Navigation";
import { hasPermission, getRole } from "@/utils/permissions";
import { getSiteData } from "@/utils/site-data";
import {
    getTrainingSnapshot,
    anmeldenFuerTraining,
    abmeldenVonTraining,
} from "@/utils/trainings";
import { getActiveAbsencesForUser, isAbsentOn } from "@/utils/absences";
import PostTrainingPrompt from "@/app/abmelden/PostTrainingPrompt";
import { buildGroups, DAY_INDEX } from "@/utils/session-groups";
import { localIso, nextTrainingDate } from "@/utils/school-holidays";

/** Next real training day (skips school holidays and free days). */
function nextOccurrenceDate(dayName: string): Date {
    return nextTrainingDate(DAY_INDEX[dayName] ?? 0);
}

function formatDate(d: Date): string {
    return d.toLocaleDateString("de-CH", { day: "numeric", month: "long" });
}

export default async function MitgliederPage() {
    const { userId } = await auth();
    if (!userId) redirect("/login");

    const user = await currentUser();
    const role = getRole(user?.publicMetadata as Record<string, unknown>);
    if (!hasPermission(role, "mitglieder:access")) redirect("/login");

    const isAdmin = role === "admin";
    const { training, contact } = await getSiteData();

    const absences = await getActiveAbsencesForUser(userId);

    const sessionData = await Promise.all(
        training.sessions.map(async (s) => {
            const snap = await getTrainingSnapshot(s.id, s.day);
            const inParticipants = snap.participants.includes(userId);
            const inAbgemeldet = snap.abgemeldet.includes(userId);
            const absent = isAbsentOn(
                absences,
                localIso(nextOccurrenceDate(s.day)),
            );
            if (!inParticipants && !inAbgemeldet) {
                // A longer absence (injury etc.) replaces the auto sign-up.
                if (absent) {
                    await abmeldenVonTraining(s.id, userId);
                    return { sessionId: s.id, angemeldet: false };
                }
                await anmeldenFuerTraining(s.id, userId);
            }
            return {
                sessionId: s.id,
                angemeldet: inParticipants || !inAbgemeldet,
            };
        }),
    );

    // Build next-training card data
    const groups = buildGroups(training.sessions);
    const statusMap = Object.fromEntries(
        sessionData.map((d) => [d.sessionId, d.angemeldet]),
    );

    const groupsWithMeta = groups.map((g) => {
        const nextDate = g.sessions.reduce<Date>((min, s) => {
            const d = nextOccurrenceDate(s.day);
            return d < min ? d : min;
        }, nextOccurrenceDate(g.sessions[0].day));
        const allAngemeldet = g.sessions.every((s) => statusMap[s.id] ?? false);
        const absence = isAbsentOn(absences, localIso(nextDate));
        return { ...g, nextDate, allAngemeldet, absence };
    });
    groupsWithMeta.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
    const nextGroup = groupsWithMeta[0] ?? null;

    const initials =
        user?.firstName && user?.lastName
            ? `${user.firstName[0]}${user.lastName[0]}`
            : (user?.emailAddresses[0]?.emailAddress?.[0] ?? "?").toUpperCase();

    const fullName =
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        user?.emailAddresses[0]?.emailAddress ||
        "Mitglied";

    return (
        <div className="min-h-screen bg-neutral-50">
            <PostTrainingPrompt
                    sessions={training.sessions}
                    userId={userId}
                    registeredSessionIds={sessionData.filter(d => d.angemeldet).map(d => d.sessionId)}
                />
            <Navigation />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-10 space-y-6">
                {/* Profile card */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {user?.imageUrl ? (
                        <Image
                            src={user.imageUrl}
                            alt={fullName}
                            width={64}
                            height={64}
                            className="rounded-full object-cover shrink-0 w-16 h-16"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                            <span className="text-white font-bold text-xl">
                                {initials}
                            </span>
                        </div>
                    )}
                    <div className="text-center sm:text-left">
                        <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                            {fullName}
                        </h1>
                        <p className="text-sm text-neutral-500 mt-0.5">
                            {user?.emailAddresses[0]?.emailAddress}
                        </p>
                        <span
                            className={`mt-2 inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                                isAdmin
                                    ? "bg-neutral-900 text-white"
                                    : "bg-neutral-100 text-neutral-600"
                            }`}
                        >
                            {isAdmin ? "Admin" : "Mitglied"}
                        </span>
                    </div>
                </div>

                {/* Next training card */}
                {nextGroup && (
                    <div className="bg-white rounded-xl border border-neutral-200 p-5 flex lg:items-center md:items-start justify-between flex-col md:flex-row gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                                <CalendarDays className="w-5 h-5 text-neutral-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-0.5">
                                    Nächstes Training
                                </p>
                                <p className="font-bold text-neutral-900">
                                    {[
                                        ...new Set(
                                            nextGroup.sessions.map(
                                                (s) => s.day,
                                            ),
                                        ),
                                    ].join(" + ")}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    {formatDate(nextGroup.nextDate)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    nextGroup.allAngemeldet
                                        ? "bg-green-50 text-green-700"
                                        : "bg-neutral-100 text-neutral-400"
                                }`}
                            >
                                {nextGroup.allAngemeldet
                                    ? "Angemeldet"
                                    : nextGroup.absence
                                      ? `Abwesend · ${nextGroup.absence.reason}`
                                      : "Abgemeldet"}
                            </span>
                            <a
                                href="/api/calendar"
                                download
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 border border-neutral-200 rounded-md hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
                            >
                                <CalendarPlus className="w-3.5 h-3.5" /> Kalender
                            </a>
                            <Link
                                href="/abmelden"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 border border-neutral-200 rounded-md hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
                            >
                                Verwalten <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-5">
                                <Mail className="w-4 h-4 text-neutral-400" />
                                <h2 className="font-bold text-neutral-900">
                                    Kontakt
                                </h2>
                            </div>
                            <a
                                href={`mailto:${contact.email}`}
                                className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors font-medium"
                            >
                                {contact.email}
                            </a>
                            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                                Bei Fragen, Absenzen oder sonstigen Anliegen
                                schreib uns einfach eine E-Mail.
                            </p>
                        </div>
                        {contact.socials.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                {contact.socials.map((s) => (
                                    <a
                                        key={s.id}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-md text-sm font-semibold hover:bg-neutral-900 hover:text-white transition-colors"
                                    >
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Account */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <User className="w-4 h-4 text-neutral-400" />
                            <h2 className="font-bold text-neutral-900">
                                Konto
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/user-profile"
                                className="px-4 py-2.5 border border-neutral-200 text-neutral-700 rounded-md text-sm font-semibold hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
                            >
                                Profil bearbeiten
                            </Link>
                            <SignOutBtn />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
