"use server";

import { auth } from "@clerk/nextjs/server";
import {
  getSiteData,
  saveSiteData,
  type SiteData,
  type Session,
  type Social,
  type Technique,
} from "@/lib/site-data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAuth() {
  const { userId } = await auth();
  if (!userId) redirect("/login");
}

export async function updateAbout(text1: string, text2: string) {
  await requireAuth();
  const data = await getSiteData();
  data.about.text1 = text1;
  data.about.text2 = text2;
  await saveSiteData(data);
  revalidatePath("/");
  revalidatePath("/dashboard/edit");
}

export async function updateStats(stats: SiteData["stats"]) {
  await requireAuth();
  const data = await getSiteData();
  data.stats = stats;
  await saveSiteData(data);
  revalidatePath("/");
  revalidatePath("/dashboard/edit");
}

export async function updateEmail(email: string) {
  await requireAuth();
  const data = await getSiteData();
  data.contact.email = email;
  await saveSiteData(data);
  revalidatePath("/kontakt");
  revalidatePath("/dashboard/edit");
}

export async function upsertSocial(social: Social) {
  await requireAuth();
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
}

export async function deleteSocial(id: string) {
  await requireAuth();
  const data = await getSiteData();
  data.contact.socials = data.contact.socials.filter((s) => s.id !== id);
  await saveSiteData(data);
  revalidatePath("/kontakt");
  revalidatePath("/mitglieder");
  revalidatePath("/dashboard/edit");
}

export async function updateLocation(location: string) {
  await requireAuth();
  const data = await getSiteData();
  data.training.location = location;
  await saveSiteData(data);
  revalidatePath("/training");
  revalidatePath("/dashboard/edit");
}

export async function upsertSession(session: Session) {
  await requireAuth();
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
}

export async function upsertTechnique(technique: Technique) {
  await requireAuth();
  const data = await getSiteData();
  if (!data.techniques) data.techniques = [];
  const idx = data.techniques.findIndex((t) => t.id === technique.id);
  if (idx >= 0) {
    data.techniques[idx] = technique;
  } else {
    data.techniques.push(technique);
  }
  await saveSiteData(data);
  revalidatePath("/training");
  revalidatePath("/dashboard/edit");
}

export async function deleteTechnique(id: string) {
  await requireAuth();
  const data = await getSiteData();
  data.techniques = (data.techniques ?? []).filter((t) => t.id !== id);
  await saveSiteData(data);
  revalidatePath("/training");
  revalidatePath("/dashboard/edit");
}

export async function deleteSession(id: string) {
  await requireAuth();
  const data = await getSiteData();
  data.training.sessions = data.training.sessions.filter((s) => s.id !== id);
  data.stats.sessionsPerWeek = data.training.sessions.length.toString();
  await saveSiteData(data);
  revalidatePath("/training");
  revalidatePath("/");
  revalidatePath("/dashboard/edit");
}
