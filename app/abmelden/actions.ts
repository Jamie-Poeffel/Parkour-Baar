"use server";

import { revalidatePath } from "next/cache";
import { abmeldenVonTraining } from "@/utils/trainings";
import { logAction } from "@/lib/axiom/action";
import { requirePermission } from "@/lib/auth";

export async function abmeldenAction(trainingsId: string) {
    // userId comes from the session, never from the client
    const { userId } = await requirePermission("mitglieder:access");

    await logAction("abmeldenAction", { trainingsId, userId }, async () => {
        await abmeldenVonTraining(trainingsId, userId);
        revalidatePath("/mitglieder");
    });
}
