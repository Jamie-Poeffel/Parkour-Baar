"use server";

import { auth } from "@clerk/nextjs/server";
import {
  getSiteData,
  saveSiteData,
  type SiteData,
  type Session,
  type Social,
  type Partner,
} from "@/utils/site-data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logger } from "@/lib/axiom/server";

async function requireAuth() {
  const { userId } = await auth();
  if (!userId) redirect("/login");
  return userId;
}

async function logAction(name: string, meta: Record<string, unknown>, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    logger.info(`action:${name}`, { ...meta, durationMs: Date.now() - start });
  } catch (err) {
    logger.error(`action:${name}:error`, { ...meta, error: String(err), durationMs: Date.now() - start });
    throw err;
  } finally {
    await logger.flush();
  }
}

export async function updateAbout(text1: string, text2: string) {
  const userId = await requireAuth();
  await logAction("updateAbout", { userId }, async () => {
    const data = await getSiteData();
    data.about.text1 = text1;
    data.about.text2 = text2;
    await saveSiteData(data);
    revalidatePath("/");
    revalidatePath("/dashboard/edit");
  });
}

export async function updateStats(stats: SiteData["stats"]) {
  const userId = await requireAuth();
  await logAction("updateStats", { userId, stats }, async () => {
    const data = await getSiteData();
    data.stats = stats;
    await saveSiteData(data);
    revalidatePath("/");
    revalidatePath("/dashboard/edit");
  });
}

export async function updateEmail(email: string) {
  const userId = await requireAuth();
  await logAction("updateEmail", { userId, email }, async () => {
    const data = await getSiteData();
    data.contact.email = email;
    await saveSiteData(data);
    revalidatePath("/kontakt");
    revalidatePath("/dashboard/edit");
  });
}

export async function upsertSocial(social: Social) {
  const userId = await requireAuth();
  await logAction("upsertSocial", { userId, socialId: social.id, label: social.label }, async () => {
    const data = await getSiteData();
    const idx = data.contact.socials.findIndex((s) => s.id === social.id);
    if (idx >= 0) {
      data.contact.socials[idx] = social;
    } else {
      data.contact.socials.push(social);
    }
    await saveSiteData(data);
    revalidatePath("/kontakt");
    revalidatePath("/mitglieder");
    revalidatePath("/dashboard/edit");
  });
}

export async function deleteSocial(id: string) {
  const userId = await requireAuth();
  await logAction("deleteSocial", { userId, socialId: id }, async () => {
    const data = await getSiteData();
    data.contact.socials = data.contact.socials.filter((s) => s.id !== id);
    await saveSiteData(data);
    revalidatePath("/kontakt");
    revalidatePath("/mitglieder");
    revalidatePath("/dashboard/edit");
  });
}

export async function updateLocation(location: string) {
  const userId = await requireAuth();
  await logAction("updateLocation", { userId, location }, async () => {
    const data = await getSiteData();
    data.training.location = location;
    await saveSiteData(data);
    revalidatePath("/training");
    revalidatePath("/dashboard/edit");
  });
}

export async function upsertSession(session: Session) {
  const userId = await requireAuth();
  await logAction("upsertSession", { userId, sessionId: session.id, day: session.day }, async () => {
    const data = await getSiteData();
    const idx = data.training.sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      data.training.sessions[idx] = session;
    } else {
      data.training.sessions.push(session);
    }
    data.stats.sessionsPerWeek = data.training.sessions.length.toString();
    await saveSiteData(data);
    revalidatePath("/training");
    revalidatePath("/");
    revalidatePath("/dashboard/edit");
  });
}

export async function deleteSession(id: string) {
  const userId = await requireAuth();
  await logAction("deleteSession", { userId, sessionId: id }, async () => {
    const data = await getSiteData();
    data.training.sessions = data.training.sessions.filter((s) => s.id !== id);
    data.stats.sessionsPerWeek = data.training.sessions.length.toString();
    await saveSiteData(data);
    revalidatePath("/training");
    revalidatePath("/");
    revalidatePath("/dashboard/edit");
  });
}

export async function upsertPartner(partner: Partner) {
  const userId = await requireAuth();
  await logAction("upsertPartner", { userId, partnerId: partner.id, name: partner.name }, async () => {
    const data = await getSiteData();
    if (!data.partners) data.partners = [];
    const idx = data.partners.findIndex((p) => p.id === partner.id);
    if (idx >= 0) {
      data.partners[idx] = partner;
    } else {
      data.partners.push(partner);
    }
    await saveSiteData(data);
    revalidatePath("/");
    revalidatePath("/dashboard/edit");
  });
}

export async function deletePartner(id: string) {
  const userId = await requireAuth();
  await logAction("deletePartner", { userId, partnerId: id }, async () => {
    const data = await getSiteData();
    data.partners = (data.partners ?? []).filter((p) => p.id !== id);
    await saveSiteData(data);
    revalidatePath("/");
    revalidatePath("/dashboard/edit");
  });
}
