"use server";

import { revalidatePath } from "next/cache";
import { abmeldenVonTraining } from "@/utils/trainings";
import { requestLogger as logger } from "@/lib/axiom/request-logger";
import { startTimer, getDurationMs } from "@/lib/axiom/timing";

export async function abmeldenAction(trainingsId: string, userId: string) {
  const start = startTimer();

  try {
    await abmeldenVonTraining(trainingsId, userId);
    revalidatePath("/mitglieder");

    await logger.info("action:abmeldenAction", {
      trainingsId,
      userId,
      durationMs: getDurationMs(start),
    });
  } catch (err) {
    await logger.error("action:abmeldenAction:error", {
      trainingsId,
      userId,
      error: String(err),
      durationMs: getDurationMs(start),
    });

    throw err;
  }
}
