import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Users, Calendar, ExternalLink, Pencil } from "lucide-react";
import { getSiteData } from "@/lib/site-data";
import { Navigation } from "@/components/Navigation";
import { hasPermission, getRole } from "@/lib/permissions";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const [user, { training, stats }] = await Promise.all([
    currentUser(),
    getSiteData(),
  ]);

  const role = getRole(user?.publicMetadata as Record<string, unknown>);
  if (!hasPermission(role, "dashboard:access")) redirect("/mitglieder");

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10">
        {/* Page heading */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-neutral-500 mt-1">
              Willkommen zurück,{" "}
              {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}.
            </p>
          </div>
          {hasPermission(role, "dashboard:edit") && (
            <Link
              href="/dashboard/edit"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-md hover:bg-neutral-700 transition-colors self-start sm:self-auto shrink-0"
            >
              <Pencil className="w-4 h-4" /> Website bearbeiten
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {[
            { label: "Mitglieder", value: stats.members, icon: Users },
            { label: "Trainings/Woche", value: stats.sessionsPerWeek, icon: Calendar },
            { label: "Coaches", value: stats.coaches, icon: Users },
            { label: "Jahre aktiv", value: stats.years, icon: Calendar },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {label}
                </span>
                <Icon className="w-4 h-4 text-neutral-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-neutral-900">
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
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-medium text-neutral-900 w-20 sm:w-24">
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
