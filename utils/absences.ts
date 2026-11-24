import "server-only";

import { db } from "@/utils/firebase-admin";
import { zurichToday } from "@/utils/school-holidays";

export const ABSENCE_REASONS = [
    "Verletzung",
    "Krankheit",
    "Ferien",
    "Schule / Arbeit",
    "Sonstiges",
] as const;
export type AbsenceReason = (typeof ABSENCE_REASONS)[number];

export type Absence = {
    id: string;
    userId: string;
    /** First day of the absence, YYYY-MM-DD. */
    from: string;
    /** Last day, YYYY-MM-DD; null = until further notice. */
    to: string | null;
    reason: AbsenceReason;
    note: string;
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIso(s: string): boolean {
    if (!ISO.test(s)) return false;
    const d = new Date(`${s}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function toAbsence(
    doc: FirebaseFirestore.QueryDocumentSnapshot,
): Absence {
    const d = doc.data();
    return {
        id: doc.id,
        userId: d.userId,
        from: d.from,
        to: d.to ?? null,
        reason: d.reason,
        note: d.note ?? "",
    };
}

/** True if the absence covers the given day (YYYY-MM-DD). */
export function covers(a: Absence, iso: string): boolean {
    return a.from <= iso && (a.to === null || iso <= a.to);
}

export function isAbsentOn(absences: Absence[], iso: string): Absence | null {
    return absences.find((a) => covers(a, iso)) ?? null;
}

/** All of a member's current and future absences, soonest first. */
export async function getActiveAbsencesForUser(
    userId: string,
): Promise<Absence[]> {
    const snap = await db
        .collection("absences")
        .where("userId", "==", userId)
        .get();
    const today = zurichToday();
    return snap.docs
        .map(toAbsence)
        .filter((a) => a.to === null || a.to >= today)
        .sort((a, b) => a.from.localeCompare(b.from));
}

/** Everyone's current and future absences (coach overview). */
export async function getAllActiveAbsences(): Promise<Absence[]> {
    const snap = await db.collection("absences").get();
    const today = zurichToday();
    return snap.docs
        .map(toAbsence)
        .filter((a) => a.to === null || a.to >= today)
        .sort((a, b) => a.from.localeCompare(b.from));
}

export async function addAbsence(a: Omit<Absence, "id">): Promise<void> {
    await db.collection("absences").add({ ...a, createdAt: new Date() });
}

/** Deletes only if the absence belongs to `userId`. */
export async function deleteAbsence(
    id: string,
    userId: string,
): Promise<void> {
    const ref = db.collection("absences").doc(id);
    const snap = await ref.get();
    if (snap.exists && snap.data()?.userId === userId) await ref.delete();
}
