import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, User } from "lucide-react";
import { SignOutBtn } from "@/components/SignOutBtn";
import { Navigation } from "@/components/Navigation";
import { hasPermission, getRole } from "@/lib/permissions";
import { getSiteData } from "@/lib/site-data";
import { getTrainingSnapshot, anmeldenFuerTraining, abmeldenVonTraining } from "@/lib/trainings";
import { revalidatePath } from "next/cache";
import { TrainingSection } from "@/components/TrainingSection";

export default async function MitgliederPage() {
    const { userId } = await auth();
    if (!userId) redirect("/login");

    const user = await currentUser();
    const role = getRole(user?.publicMetadata as Record<string, unknown>);
    if (!hasPermission(role, "mitglieder:access")) redirect("/login");

    const isAdmin = role === "admin";
    const { training, contact } = await getSiteData();

    const sessionData = await Promise.all(
        training.sessions.map(async (s) => {
            const snap = await getTrainingSnapshot(s.id, s.day);
            const inParticipants = snap.participants.includes(userId);
            const inAbgemeldet = snap.abgemeldet.includes(userId);
            if (!inParticipants && !inAbgemeldet) {
                await anmeldenFuerTraining(s.id, userId);
            }
            return { sessionId: s.id, angemeldet: inParticipants || (!inAbgemeldet) };
        }),
    );

    async function handleAnmelden(trainingId: string) {
        "use server";
        if (!userId) return;
        await anmeldenFuerTraining(trainingId, userId);
        revalidatePath("/mitglieder");
    }

    async function handleAbmelden(trainingId: string) {
        "use server";
        if (!userId) return;
        await abmeldenVonTraining(trainingId, userId);
        revalidatePath("/mitglieder");
    }

    async function handleAnmeldenAll(trainingIds: string[]) {
        "use server";
        if (!userId) return;
        await Promise.all(trainingIds.map((id) => anmeldenFuerTraining(id, userId)));
        revalidatePath("/mitglieder");
    }

    async function handleAbmeldenAll(trainingIds: string[]) {
        "use server";
        if (!userId) return;
        await Promise.all(trainingIds.map((id) => abmeldenVonTraining(id, userId)));
        revalidatePath("/mitglieder");
    }

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
                            <span className="text-white font-bold text-xl">{initials}</span>
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

                {/* Training sign-up/off */}
                <TrainingSection
                    sessions={training.sessions}
                    sessionData={sessionData}
                    location={training.location}
                    onAnmelden={handleAnmelden}
                    onAbmelden={handleAbmelden}
                    onAnmeldenAll={handleAnmeldenAll}
                    onAbmeldenAll={handleAbmeldenAll}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-5">
                                <Mail className="w-4 h-4 text-neutral-400" />
                                <h2 className="font-bold text-neutral-900">Kontakt</h2>
                            </div>
                            <a
                                href={`mailto:${contact.email}`}
                                className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors font-medium"
                            >
                                {contact.email}
                            </a>
                            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                                Bei Fragen, Absenzen oder sonstigen Anliegen schreib uns
                                einfach eine E-Mail.
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
                            <h2 className="font-bold text-neutral-900">Konto</h2>
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
