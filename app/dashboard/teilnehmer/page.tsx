import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { getTrainingSnapshot, abmeldenVonTraining, resetTraining } from "@/lib/trainings";
import { getSiteData } from "@/lib/site-data";
import { hasPermission, getRole } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

async function resolveUsers(ids: string[]) {
    if (ids.length === 0) return [];
    const client = await clerkClient();
    return Promise.all(
        ids.map(async (id) => {
            try {
                const u = await client.users.getUser(id);
                return {
                    id,
                    name:
                        [u.firstName, u.lastName].filter(Boolean).join(" ") ||
                        u.emailAddresses[0]?.emailAddress ||
                        id,
                    email: u.emailAddresses[0]?.emailAddress ?? "",
                    imageUrl: u.imageUrl ?? null,
                };
            } catch {
                return { id, name: id, email: "", imageUrl: null };
            }
        }),
    );
}

export default async function TeilnehmerPage() {
    const { userId } = await auth();
    if (!userId) redirect("/login");

    const user = await currentUser();
    const role = getRole(user?.publicMetadata as Record<string, unknown>);
    if (!hasPermission(role, "dashboard:access")) redirect("/dashboard");

    const { training } = await getSiteData();

    const sessionData = await Promise.all(
        training.sessions.map(async (s) => {
            const snap = await getTrainingSnapshot(s.id, s.day);
            const [participants, abgemeldet] = await Promise.all([
                resolveUsers(snap.participants),
                resolveUsers(snap.abgemeldet),
            ]);
            return { session: s, participants, abgemeldet };
        }),
    );

    async function handleEntfernen(formData: FormData) {
        "use server";
        const trainingId = formData.get("trainingId") as string;
        const targetUserId = formData.get("userId") as string;
        if (!trainingId || !targetUserId) return;
        await abmeldenVonTraining(trainingId, targetUserId);
        revalidatePath("/dashboard/teilnehmer");
    }

    async function handleReset(formData: FormData) {
        "use server";
        const trainingId = formData.get("trainingId") as string;
        if (!trainingId) return;
        await resetTraining(trainingId);
        revalidatePath("/dashboard/teilnehmer");
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Link>
                    <span className="text-neutral-300">/</span>
                    <span className="text-sm font-semibold text-neutral-900">Teilnehmer</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                    Teilnehmerlisten
                </h1>

                {sessionData.map(({ session: s, participants, abgemeldet }) => (
                    <div key={s.id} className="bg-white rounded-xl border border-neutral-200">
                        {/* Session header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                            <div>
                                <p className="font-bold text-neutral-900">{s.day}</p>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    {s.time} · {s.level}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 text-sm text-neutral-500">
                                    <Users className="w-4 h-4" /> {participants.length}
                                </span>
                                <form action={handleReset}>
                                    <input type="hidden" name="trainingId" value={s.id} />
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 text-xs font-semibold text-neutral-500 border border-neutral-200 rounded-md hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Liste zurücksetzen
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Angemeldet */}
                        <div className="px-6 py-4 border-b border-neutral-100">
                            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                                Angemeldet ({participants.length})
                            </p>
                            {participants.length === 0 ? (
                                <p className="text-sm text-neutral-400">Noch niemand angemeldet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {participants.map((u) => (
                                        <li key={u.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {u.imageUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={u.imageUrl}
                                                        alt={u.name}
                                                        className="w-7 h-7 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                                                        {u.name[0]?.toUpperCase() ?? "?"}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-900">{u.name}</p>
                                                    {u.email && (
                                                        <p className="text-xs text-neutral-400">{u.email}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <form action={handleEntfernen}>
                                                <input type="hidden" name="trainingId" value={s.id} />
                                                <input type="hidden" name="userId" value={u.id} />
                                                <button
                                                    type="submit"
                                                    className="text-xs text-neutral-400 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                                >
                                                    Entfernen
                                                </button>
                                            </form>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Abgemeldet */}
                        <div className="px-6 py-4">
                            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                                Abgemeldet ({abgemeldet.length})
                            </p>
                            {abgemeldet.length === 0 ? (
                                <p className="text-sm text-neutral-400">Noch niemand abgemeldet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {abgemeldet.map((u) => (
                                        <li key={u.id} className="flex items-center gap-3 opacity-60">
                                            {u.imageUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={u.imageUrl}
                                                    alt={u.name}
                                                    className="w-7 h-7 rounded-full object-cover grayscale"
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                                                    {u.name[0]?.toUpperCase() ?? "?"}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-700 line-through">{u.name}</p>
                                                {u.email && (
                                                    <p className="text-xs text-neutral-400">{u.email}</p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}
