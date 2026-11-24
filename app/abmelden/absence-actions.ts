"use server";

import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/axiom/action";
import { requirePermission } from "@/lib/auth";
import { getSiteData } from "@/utils/site-data";
import { DAY_INDEX } from "@/utils/session-groups";
import { abmeldenVonTraining } from "@/utils/trainings";
import { localIso, nextTrainingDate, zurichToday } from "@/utils/school-holidays";
import {
    ABSENCE_REASONS,
    addAbsence,
    deleteAbsence,
    isValidIso,
    type AbsenceReason,
} from "@/utils/absences";

export async function addAbsenceAction(formData: FormData) {
    // userId comes from the session, never from the client
    const { userId } = await requirePermission("mitglieder:access");

    const from = String(formData.get("from") ?? "");
    const toRaw = String(formData.get("to") ?? "");
    const reason = String(formData.get("reason") ?? "") as AbsenceReason;
    const note = String(formData.get("note") ?? "").trim().slice(0, 300);
    const to = toRaw === "" ? null : toRaw;

    const today = zurichToday();
    if (!isValidIso(from) || (to !== null && !isValidIso(to))) return;
    if (!ABSENCE_REASONS.includes(reason)) return;
    if (to !== null && to < from) return;
    if ((to ?? from) < today) return;

    await logAction(
        "addAbsenceAction",
        { userId, from, to, reason },
        async () => {
            await addAbsence({ userId, from, to, reason, note });

            // Sign the member off right away for sessions whose next training
            // falls inside the absence.
            const { training } = await getSiteData();
            for (const s of training.sessions) {
                const iso = localIso(
                    nextTrainingDate(DAY_INDEX[s.day] ?? 0),
                );
                if (from <= iso && (to === null || iso <= to)) {
                    await abmeldenVonTraining(s.id, userId);
                }
            }

            revalidatePath("/abmelden");
            revalidatePath("/mitglieder");
        },
    );
}

export async function deleteAbsenceAction(formData: FormData) {
    const { userId } = await requirePermission("mitglieder:access");
    const id = String(formData.get("absenceId") ?? "");
    if (!id) return;

    await logAction("deleteAbsenceAction", { userId, id }, async () => {
        await deleteAbsence(id, userId);
        revalidatePath("/abmelden");
        revalidatePath("/mitglieder");
    });
}
