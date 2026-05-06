/**
 * EditClient — root client component for the admin "Website bearbeiten" page.
 *
 * Renders the page layout (sticky header + main content area) and composes all
 * editable sections. Each section is its own component in
 * components/dashboard/edit/ and manages its own local state + server actions.
 *
 * This file intentionally contains no business logic — it is only responsible
 * for layout and wiring the sections together with the initial data from the
 * server.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { SignOutBtn } from "@/components/SignOutBtn";
import { SessionsSection } from "@/components/dashboard/edit/SessionsSection";
import { StatsSection } from "@/components/dashboard/edit/StatsSection";
import { AboutSection } from "@/components/dashboard/edit/AboutSection";
import { ContactSection } from "@/components/dashboard/edit/ContactSection";
import { TechniquesSection } from "@/components/dashboard/edit/TechniquesSection";
import type { SiteData } from "@/utils/site-data";

type Props = { data: SiteData };

export function EditClient({ data }: Props) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src="/dark_icon.png"
              alt="Parkour Baar"
              width={24}
              height={24}
              className="object-contain shrink-0"
            />
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <span className="text-neutral-300 hidden sm:inline">/</span>
            <span className="text-sm font-semibold text-neutral-900 hidden sm:inline truncate">
              Website bearbeiten
            </span>
          </div>
          <SignOutBtn />
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
