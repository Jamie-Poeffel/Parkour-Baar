import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Users, Calendar, LogOut, ExternalLink, Pencil } from "lucide-react";
import { getSiteData } from "@/lib/site-data";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const [user, { training, stats }] = await Promise.all([
    currentUser(),
    getSiteData(),
  ]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/dark_icon.png"
              alt="Parkour Baar"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="font-bold text-neutral-900 tracking-tight">
              Parkour Baar
            </span>
            <span className="text-neutral-300 mx-2">|</span>
            <span className="text-sm text-neutral-500">Dashboard</span>
            <span className="text-neutral-300 mx-1">·</span>
            <Link
              href="/mitglieder"
              className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Mein Bereich
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500 hidden sm:block">
              {user?.emailAddresses[0]?.emailAddress}
            </span>
            <SignOutButton redirectUrl="/">
              <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                <LogOut className="w-4 h-4" />
                Abmelden
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-neutral-500 mt-1">
              Willkommen zurück,{" "}
              {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}.
            </p>
          </div>
          <Link
            href="/dashboard/edit"
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 transition-colors shrink-0"
          >
            <Pencil className="w-4 h-4" /> Website bearbeiten
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Mitglieder", value: stats.members, icon: Users },
            {
              label: "Trainings/Woche",
              value: stats.sessionsPerWeek,
              icon: Calendar,
            },
            { label: "Coaches", value: stats.coaches, icon: Users },
            { label: "Jahre aktiv", value: stats.years, icon: Calendar },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-neutral-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {label}
                </span>
                <Icon className="w-4 h-4 text-neutral-300" />
              </div>
              <div className="text-3xl font-black text-neutral-900">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-bold text-neutral-900 mb-4">Website</h2>
            <div className="space-y-1">
              {[
                { href: "/", label: "Startseite" },
                { href: "/training", label: "Training" },
                { href: "/kontakt", label: "Kontakt" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors group"
                >
                  <span className="text-sm text-neutral-700 group-hover:text-neutral-900">
                    {label}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-bold text-neutral-900 mb-4">Trainingszeiten</h2>
            <div className="space-y-3">
              {training.sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-neutral-900 w-24">
                      {s.day}
                    </span>
                    <span className="text-neutral-500">{s.time}</span>
                  </div>
                  <span className="text-xs text-neutral-400">{s.level}</span>
                </div>
              ))}
              {training.sessions.length === 0 && (
                <p className="text-sm text-neutral-400">
                  Keine Trainings eingetragen.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
