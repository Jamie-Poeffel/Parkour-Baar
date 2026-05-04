import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// 0 = Sunday, 1 = Monday, …, 6 = Saturday (matches JS getDay())
const DAY_INDEX: Record<string, number> = {
    Sonntag: 0,
    Montag: 1,
    Dienstag: 2,
    Mittwoch: 3,
    Donnerstag: 4,
    Freitag: 5,
    Samstag: 6,
};

/**
 * Returns midnight (local time) of the most recent occurrence of `dayName`
 * in the current week (Mon–Sun). If today IS that day, returns today's midnight.
 */
function thisWeeksOccurrence(dayName: string): Date {
    const target = DAY_INDEX[dayName];
    if (target === undefined) return new Date(0);
    const now = new Date();
    const diff = now.getDay() - target;
    const d = new Date(now);
    d.setDate(now.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

export async function anmeldenFuerTraining(trainingId: string, userId: string) {
    const ref = db.collection("trainings").doc(trainingId);
    await ref.set(
        {
            participants: { [userId]: true },
            abgemeldet: { [userId]: FieldValue.delete() },
        },
        { merge: true },
    );
}

export async function abmeldenVonTraining(trainingId: string, userId: string) {
    const ref = db.collection("trainings").doc(trainingId);
    await ref.set(
        {
            participants: { [userId]: FieldValue.delete() },
            abgemeldet: { [userId]: true },
        },
        { merge: true },
    );
}

export async function isAngemeldet(
    trainingId: string,
    userId: string,
): Promise<boolean> {
    const snap = await db.collection("trainings").doc(trainingId).get();
    return snap.data()?.participants?.[userId] === true;
}

export async function getTrainingSnapshot(
    trainingId: string,
    sessionDay?: string,
): Promise<{ participants: string[]; abgemeldet: string[] }> {
    const ref = db.collection("trainings").doc(trainingId);
    const snap = await ref.get();
    const data = snap.data() ?? {};

    // Auto-reset if the session day has passed since the last reset
    if (sessionDay) {
        const occurrence = thisWeeksOccurrence(sessionDay);
        const now = new Date();
        const resetAt: Date = data.resetAt?.toDate?.() ?? new Date(0);

        if (now >= occurrence && resetAt < occurrence) {
            await ref.set(
                { participants: {}, abgemeldet: {}, resetAt: occurrence },
                { merge: true },
            );
            return { participants: [], abgemeldet: [] };
        }
    }

    const participants = Object.entries(data.participants ?? {})
        .filter(([, v]) => v === true)
        .map(([id]) => id);

    const abgemeldet = Object.entries(data.abgemeldet ?? {})
        .filter(([, v]) => v === true)
        .map(([id]) => id);

    return { participants, abgemeldet };
}

export async function resetTraining(trainingId: string) {
    const ref = db.collection("trainings").doc(trainingId);
    await ref.set(
        { participants: {}, abgemeldet: {}, resetAt: new Date() },
        { merge: true },
    );
}
