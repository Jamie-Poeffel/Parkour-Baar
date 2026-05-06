"use server";

import { revalidatePath } from "next/cache";
import { abmeldenVonTraining } from "@/utils/trainings";

export async function abmeldenAction(trainingsId: string, userId: string) {
    await abmeldenVonTraining(trainingsId, userId);
    revalidatePath("/mitglieder");
}
