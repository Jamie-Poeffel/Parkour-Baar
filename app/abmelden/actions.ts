"use server";

import { revalidatePath } from "next/cache";
import { abmeldenVonTraining } from "@/utils/trainings";
import { logger } from "@/lib/axiom/server";

export async function abmeldenAction(trainingsId: string, userId: string) {
    const start = Date.now();
    try {
        await abmeldenVonTraining(trainingsId, userId);
        revalidatePath("/mitglieder");
        logger.info("action:abmeldenAction", { trainingsId, userId, durationMs: Date.now() - start });
    } catch (err) {
        logger.error("action:abmeldenAction:error", { trainingsId, userId, error: String(err), durationMs: Date.now() - start });
        throw err;
    } finally {
        await logger.flush();
    }
}
