import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { hasPermission, getRole } from "@/lib/permissions";
import { getSiteData } from "@/lib/site-data";
import { getTrainingSnapshot, anmeldenFuerTraining, abmeldenVonTraining } from "@/lib/trainings";
import { revalidatePath } from "next/cache";

export default async function AbmeldenPage() {
    const { userId } = await auth();
    if (!userId) redirect("/login");

    const user = await currentUser();
    const role = getRole(user?.publicMetadata as Record<string, unknown>);
    if (!hasPermission(role, "mitglieder:access")) redirect("/login");

    const { training } = await getSiteData();

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
        await anmeldenFuerTraining(trainingId, userId);
        revalidatePath("/abmelden");
    }

    async function handleAbmelden(formData: FormData) {
        "use server";
        const trainingId = formData.get("trainingId") as string;
        if (!trainingId || !userId) return;
        await abmeldenVonTraining(trainingId, userId);
        revalidatePath("/abmelden");
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
                                    <p className="font-bold text-neutral-900">{s.day}</p>
                                    <p className="text-sm text-neutral-500 mt-0.5">
                                        {s.time}
                                        {s.level && (
                                            <span className="ml-2 text-xs text-neutral-400">
                                                · {s.level}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                {angemeldet ? (
                                    <form action={handleAbmelden}>
                                        <input type="hidden" name="trainingId" value={s.id} />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-md hover:bg-red-100 transition-colors"
                                        >
                                            Abmelden
                                        </button>
                                    </form>
                                ) : (
                                    <form action={handleAnmelden}>
                                        <input type="hidden" name="trainingId" value={s.id} />
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
            </main>
        </div>
    );
}
