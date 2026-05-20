import { db } from "./firebase-admin";

export type Session = {
  id: string;
  day: string;
  time: string;
  level: string;
  note: string;
  linkedTo?: string;
};

export type Social = {
  id: string;
  label: string;
  url: string;
};

export type Partner = {
    id: string;
    name: string;
    logoUrl: string;
    websiteUrl: string;
};

export type SiteData = {
    training: {
        sessions: Session[];
        location: string;
    };
    about: {
        text1: string;
        text2: string;
    };
    stats: {
        members: string;
        years: string;
        sessionsPerWeek: string;
        coaches: string;
    };
    partners: Partner[];
    contact: {
        email: string;
        socials: Social[];
    };
};

const DEFAULT: SiteData = {
    training: {
        sessions: [],
        location: "Sternmatt 2, 6340 Baar",
    },
    about: {
        text1: "Parkour Baar ist ein Verein für Parkour und Bewegungskunst in Baar, Schweiz.",
        text2: "Wir trainieren gemeinsam, helfen einander und wachsen als Gemeinschaft.",
    },
    stats: {
        members: "30+",
        years: "5+",
        sessionsPerWeek: "0",
        coaches: "3",
    },
    contact: {
        email: "parkourbaar@outlook.com",
        socials: [],
    },
    partners: [],
};

const REF = () => db.collection("site").doc("data");

export async function getSiteData(): Promise<SiteData> {
  const snap = await REF().get();
  if (!snap.exists) return DEFAULT;
  return snap.data() as SiteData;
}

export async function saveSiteData(data: SiteData): Promise<void> {
  await REF().set(data);
}
