"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignOutButton } from "@clerk/nextjs";
import {
  updateAbout,
  updateStats,
  updateEmail,
  upsertSocial,
  deleteSocial,
  updateLocation,
  upsertSession,
  deleteSession,
  upsertTechnique,
  deleteTechnique,
} from "@/app/actions";
import type { SiteData, Session, Social, Technique } from "@/lib/site-data";
import {
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Clock,
  MapPin,
  Users,
  BarChart2,
  AtSign,
  Check,
  BookOpen,
} from "lucide-react";

type Props = { data: SiteData };

const DAYS = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon className="w-4 h-4 text-neutral-400" />
        <h2 className="font-bold text-neutral-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SaveButton({ pending, saved }: { pending: boolean; saved: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors"
    >
      {pending ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : saved ? (
        <Check className="w-4 h-4" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {pending ? "Speichern…" : saved ? "Gespeichert" : "Speichern"}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white";
const textareaCls = `${inputCls} resize-none`;

// ── SESSIONS SECTION ──────────────────────────────────────────────────────────
function SessionsSection({
  initial,
  location: initLocation,
}: {
  initial: Session[];
  location: string;
}) {
  const [sessions, setSessions] = useState<Session[]>(initial);
  const [location, setLocation] = useState(initLocation);
  const [editing, setEditing] = useState<Session | null>(null);
  const [isPending, startTransition] = useTransition();
  const [savedId, setSavedId] = useState<string | null>(null);

  const blank = (): Session => ({
    id: Date.now().toString(),
    day: "Dienstag",
    time: "",
    level: "",
    note: "",
  });

  function save(s: Session) {
    startTransition(async () => {
      await upsertSession(s);
      setSessions((prev) => {
        const idx = prev.findIndex((x) => x.id === s.id);
        return idx >= 0
          ? prev.map((x) => (x.id === s.id ? s : x))
          : [...prev, s];
      });
      setSavedId(s.id);
      setEditing(null);
      setTimeout(() => setSavedId(null), 2000);
    });
  }

  function remove(id: string) {
    if (!confirm("Training löschen?")) return;
    startTransition(async () => {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    });
  }

  function saveLocation() {
    startTransition(async () => {
      await updateLocation(location);
      setSavedId("location");
      setTimeout(() => setSavedId(null), 2000);
    });
  }

  return (
    <SectionCard title="Trainingszeiten" icon={Clock}>
      {/* Location */}
      <div className="mb-6 pb-6 border-b border-neutral-100">
        <Field label="Trainingsort">
          <div className="flex gap-2">
            <input
              className={inputCls}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              onClick={saveLocation}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors shrink-0"
            >
              {savedId === "location" ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </button>
          </div>
        </Field>
      </div>

      {/* Session list */}
      <div className="space-y-3 mb-4">
        {sessions.map((s) => (
          <div key={s.id} className="border border-neutral-200 rounded-lg">
            {editing?.id === s.id ? (
              <SessionForm
                session={editing}
                onChange={setEditing}
                onSave={() => save(editing)}
                onCancel={() => setEditing(null)}
                isPending={isPending}
              />
            ) : (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-neutral-900 w-24">
                    {s.day}
                  </span>
                  <span className="text-neutral-600">{s.time}</span>
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-xs">
                    {s.level}
                  </span>
                  <span className="text-neutral-400 text-xs hidden sm:block">
                    {s.note}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {savedId === s.id && (
                    <Check className="w-4 h-4 text-green-500 mr-1" />
                  )}
                  <button
                    onClick={() => setEditing({ ...s })}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    disabled={isPending}
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && !sessions.find((s) => s.id === editing.id) ? (
        <div className="border border-neutral-200 rounded-lg">
          <SessionForm
            session={editing}
            onChange={setEditing}
            onSave={() => save(editing)}
            onCancel={() => setEditing(null)}
            isPending={isPending}
          />
        </div>
      ) : !editing ? (
        <button
          onClick={() => setEditing(blank())}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-neutral-300 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 rounded-lg text-sm font-medium w-full justify-center transition-colors"
        >
          <Plus className="w-4 h-4" /> Training hinzufügen
        </button>
      ) : null}
    </SectionCard>
  );
}

function SessionForm({
  session,
  onChange,
  onSave,
  onCancel,
  isPending,
}: {
  session: Session;
  onChange: (s: Session) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tag">
          <select
            className={inputCls}
            value={session.day}
            onChange={(e) => onChange({ ...session, day: e.target.value })}
          >
            {DAYS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Zeit">
          <input
            className={inputCls}
            placeholder="18:00 – 20:00"
            value={session.time}
            onChange={(e) => onChange({ ...session, time: e.target.value })}
          />
        </Field>
        <Field label="Level">
          <input
            className={inputCls}
            placeholder="Anfänger"
            value={session.level}
            onChange={(e) => onChange({ ...session, level: e.target.value })}
          />
        </Field>
        <Field label="Hinweis">
          <input
            className={inputCls}
            placeholder="Max. 12 Teilnehmer"
            value={session.note}
            onChange={(e) => onChange({ ...session, note: e.target.value })}
          />
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Abbrechen
        </button>
        <button
          onClick={onSave}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Speichern
        </button>
      </div>
    </div>
  );
}

// ── STATS SECTION ─────────────────────────────────────────────────────────────
function StatsSection({
  initial,
  sessionsCount,
}: {
  initial: SiteData["stats"];
  sessionsCount: number;
}) {
  const [stats, setStats] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updateStats(stats);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <SectionCard title="Statistiken" icon={BarChart2}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {(["members", "years", "coaches"] as const).map((key) => (
            <Field
              key={key}
              label={
                {
                  members: "Mitglieder",
                  years: "Jahre aktiv",
                  coaches: "Coaches",
                }[key]
              }
            >
              <input
                className={inputCls}
                value={stats[key]}
                onChange={(e) => setStats({ ...stats, [key]: e.target.value })}
              />
            </Field>
          ))}
          <Field label="Trainings/Woche">
            <div
              className={`${inputCls} bg-neutral-50 text-neutral-500 cursor-default flex items-center gap-2`}
            >
              {sessionsCount}
              <span className="text-xs text-neutral-400">(automatisch)</span>
            </div>
          </Field>
        </div>
        <div className="flex justify-end">
          <SaveButton pending={isPending} saved={saved} />
        </div>
      </form>
    </SectionCard>
  );
}

// ── ABOUT SECTION ─────────────────────────────────────────────────────────────
function AboutSection({ initial }: { initial: SiteData["about"] }) {
  const [about, setAbout] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updateAbout(about.text1, about.text2);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <SectionCard title="Über uns" icon={Users}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Absatz 1">
          <textarea
            className={textareaCls}
            rows={3}
            value={about.text1}
            onChange={(e) => setAbout({ ...about, text1: e.target.value })}
          />
        </Field>
        <Field label="Absatz 2">
          <textarea
            className={textareaCls}
            rows={2}
            value={about.text2}
            onChange={(e) => setAbout({ ...about, text2: e.target.value })}
          />
        </Field>
        <div className="flex justify-end">
          <SaveButton pending={isPending} saved={saved} />
        </div>
      </form>
    </SectionCard>
  );
}

// ── CONTACT SECTION ───────────────────────────────────────────────────────────
function ContactSection({ initial }: { initial: SiteData["contact"] }) {
  const [email, setEmail] = useState(initial.email);
  const [socials, setSocials] = useState<Social[]>(initial.socials);
  const [editing, setEditing] = useState<Social | null>(null);
  const [isPending, startTransition] = useTransition();
  const [emailSaved, setEmailSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  function saveEmail() {
    startTransition(async () => {
      await updateEmail(email);
      setEmailSaved(true);
      setTimeout(() => setEmailSaved(false), 2000);
    });
  }

  function saveSocial(s: Social) {
    startTransition(async () => {
      await upsertSocial(s);
      setSocials((prev) => {
        const idx = prev.findIndex((x) => x.id === s.id);
        return idx >= 0
          ? prev.map((x) => (x.id === s.id ? s : x))
          : [...prev, s];
      });
      setSavedId(s.id);
      setEditing(null);
      setTimeout(() => setSavedId(null), 2000);
    });
  }

  function removeSocial(id: string) {
    if (!confirm("Social Link löschen?")) return;
    startTransition(async () => {
      await deleteSocial(id);
      setSocials((prev) => prev.filter((s) => s.id !== id));
    });
  }

  const blankSocial = (): Social => ({
    id: Date.now().toString(),
    label: "",
    url: "",
  });

  return (
    <SectionCard title="Kontakt & Social" icon={AtSign}>
      {/* Email */}
      <div className="mb-6 pb-6 border-b border-neutral-100">
        <Field label="E-Mail">
          <div className="flex gap-2">
            <input
              className={inputCls}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={saveEmail}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors shrink-0"
            >
              {emailSaved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </button>
          </div>
        </Field>
      </div>

      {/* Socials list */}
      <div className="space-y-2 mb-4">
        {socials.map((s) => (
          <div key={s.id} className="border border-neutral-200 rounded-lg">
            {editing?.id === s.id ? (
              <SocialForm
                social={editing}
                onChange={setEditing}
                onSave={() => saveSocial(editing)}
                onCancel={() => setEditing(null)}
                isPending={isPending}
              />
            ) : (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  {savedId === s.id && (
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  )}
                  <span className="font-semibold text-sm text-neutral-900 w-24 shrink-0">
                    {s.label}
                  </span>
                  <span className="text-sm text-neutral-400 truncate">
                    {s.url}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => setEditing({ ...s })}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => removeSocial(s.id)}
                    disabled={isPending}
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && !socials.find((s) => s.id === editing.id) ? (
        <div className="border border-neutral-200 rounded-lg">
          <SocialForm
            social={editing}
            onChange={setEditing}
            onSave={() => saveSocial(editing)}
            onCancel={() => setEditing(null)}
            isPending={isPending}
          />
        </div>
      ) : (
        <button
          onClick={() => setEditing(blankSocial())}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-neutral-300 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 rounded-lg text-sm font-medium w-full justify-center transition-colors"
        >
          <Plus className="w-4 h-4" /> Social Link hinzufügen
        </button>
      )}
    </SectionCard>
  );
}

function SocialForm({
  social,
  onChange,
  onSave,
  onCancel,
  isPending,
}: {
  social: Social;
  onChange: (s: Social) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name (z.B. Instagram)">
          <input
            className={inputCls}
            placeholder="Instagram"
            value={social.label}
            onChange={(e) => onChange({ ...social, label: e.target.value })}
          />
        </Field>
        <Field label="URL">
          <input
            className={inputCls}
            placeholder="https://..."
            value={social.url}
            onChange={(e) => onChange({ ...social, url: e.target.value })}
          />
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Abbrechen
        </button>
        <button
          onClick={onSave}
          disabled={isPending || !social.label || !social.url}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Speichern
        </button>
      </div>
    </div>
  );
}

// ── TECHNIQUES SECTION ────────────────────────────────────────────────────────
function TechniquesSection({ initial }: { initial: Technique[] }) {
  const [techniques, setTechniques] = useState<Technique[]>(initial);
  const [editing, setEditing] = useState<Technique | null>(null);
  const [isPending, startTransition] = useTransition();
  const [savedId, setSavedId] = useState<string | null>(null);

  function save(t: Technique) {
    startTransition(async () => {
      await upsertTechnique(t);
      setTechniques((prev) => {
        const idx = prev.findIndex((x) => x.id === t.id);
        return idx >= 0
          ? prev.map((x) => (x.id === t.id ? t : x))
          : [...prev, t];
      });
      setSavedId(t.id);
      setEditing(null);
      setTimeout(() => setSavedId(null), 2000);
    });
  }

  function remove(id: string) {
    if (!confirm("Technik löschen?")) return;
    startTransition(async () => {
      await deleteTechnique(id);
      setTechniques((prev) => prev.filter((t) => t.id !== id));
    });
  }

  const blank = (): Technique => ({
    id: Date.now().toString(),
    name: "",
    desc: "",
  });

  return (
    <SectionCard title="Was du lernst" icon={BookOpen}>
      <div className="space-y-2 mb-4">
        {techniques.map((t) => (
          <div key={t.id} className="border border-neutral-200 rounded-lg">
            {editing?.id === t.id ? (
              <TechniqueForm
                technique={editing}
                onChange={setEditing}
                onSave={() => save(editing)}
                onCancel={() => setEditing(null)}
                isPending={isPending}
              />
            ) : (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4 min-w-0">
                  {savedId === t.id && (
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  )}
                  <span className="font-semibold text-sm text-neutral-900 w-32 shrink-0">
                    {t.name}
                  </span>
                  <span className="text-sm text-neutral-400 truncate">
                    {t.desc}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => setEditing({ ...t })}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => remove(t.id)}
                    disabled={isPending}
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && !techniques.find((t) => t.id === editing.id) ? (
        <div className="border border-neutral-200 rounded-lg">
          <TechniqueForm
            technique={editing}
            onChange={setEditing}
            onSave={() => save(editing)}
            onCancel={() => setEditing(null)}
            isPending={isPending}
          />
        </div>
      ) : !editing ? (
        <button
          onClick={() => setEditing(blank())}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-neutral-300 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 rounded-lg text-sm font-medium w-full justify-center transition-colors"
        >
          <Plus className="w-4 h-4" /> Technik hinzufügen
        </button>
      ) : null}
    </SectionCard>
  );
}

function TechniqueForm({
  technique,
  onChange,
  onSave,
  onCancel,
  isPending,
}: {
  technique: Technique;
  onChange: (t: Technique) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name (z.B. Kong Vault)">
          <input
            className={inputCls}
            placeholder="Kong Vault"
            value={technique.name}
            onChange={(e) => onChange({ ...technique, name: e.target.value })}
          />
        </Field>
        <Field label="Beschreibung">
          <input
            className={inputCls}
            placeholder="Hindernisse mit beiden Händen überwinden"
            value={technique.desc}
            onChange={(e) => onChange({ ...technique, desc: e.target.value })}
          />
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Abbrechen
        </button>
        <button
          onClick={onSave}
          disabled={isPending || !technique.name}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Speichern
        </button>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export function EditClient({ data }: Props) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/dark_icon.png"
              alt="Parkour Baar"
              width={24}
              height={24}
              className="object-contain"
            />
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-sm font-semibold text-neutral-900">
              Website bearbeiten
            </span>
          </div>
          <SignOutButton redirectUrl="/">
            <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              <LogOut className="w-4 h-4" /> Abmelden
            </button>
          </SignOutButton>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Website bearbeiten
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Änderungen werden sofort auf der Website aktualisiert.
          </p>
        </div>

        <SessionsSection
          initial={data.training.sessions}
          location={data.training.location}
        />
        <TechniquesSection initial={data.techniques ?? []} />
        <StatsSection
          initial={data.stats}
          sessionsCount={data.training.sessions.length}
        />
        <AboutSection initial={data.about} />
        <ContactSection initial={data.contact} />
      </main>
    </div>
  );
}
