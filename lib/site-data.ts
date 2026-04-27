import { db } from "./firebase-admin";

export type Session = {
  id: string;
  day: string;
  time: string;
  level: string;
  note: string;
};

export type Social = {
  id: string;
  label: string;
  url: string;
};

export type Technique = {
  id: string;
  name: string;
  desc: string;
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
  contact: {
    email: string;
    socials: Social[];
  };
  techniques: Technique[];
};

const DEFAULT: SiteData = {
  training: {
    sessions: [],
    location: "Sternmatt 2, 6340 Baar",
  },
  about: {
    text1:
      "Parkour Baar ist ein Verein für Parkour und Bewegungskunst in Baar, Schweiz.",
    text2:
      "Wir trainieren gemeinsam, helfen einander und wachsen als Gemeinschaft.",
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
  techniques: [
    {
      id: "1",
      name: "Precision Jump",
      desc: "Präzise Sprünge auf definierte Ziele",
    },
    {
      id: "2",
      name: "Kong Vault",
      desc: "Hindernisse mit beiden Händen überwinden",
    },
    { id: "3", name: "Speed Vault", desc: "Schnelles Überspringen im Lauf" },
    { id: "4", name: "Tic Tac", desc: "Wandabdruck zur Richtungsänderung" },
    {
      id: "5",
      name: "Cat Balance",
      desc: "Gleichgewicht auf Mauerkanten halten",
    },
    { id: "6", name: "Underbar", desc: "Durchgleiten unter Hindernissen" },
    { id: "7", name: "Wall Run", desc: "Senkrechte Flächen kurz hinauflaufen" },
    { id: "8", name: "Lazy Vault", desc: "Entspanntes, seitliches Überwinden" },
    { id: "9", name: "Dash Vault", desc: "Füsse-zuerst über ein Hindernis" },
  ],
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
