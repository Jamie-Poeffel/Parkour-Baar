import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import framePng from "@/public/frame.webp";
import HomePng from "@/public/pic_6-2.webp";
import { getSiteData } from "@/utils/site-data";

export default async function Home() {
  const { about, stats } = await getSiteData();

  return (
    <>
      <Navigation />

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[600px] flex items-end">
        <Image
          src={HomePng}
          alt="Parkour athlete backflip"
          fill
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,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"
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-28">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-white/60 mb-4 fade-up">
            Sportclub · Baar, Schweiz
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter fade-up delay-100">
            Parkour
            <br />
            Baar
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/75 max-w-md leading-relaxed fade-up delay-200">
            Lerne die Kunst der effizienten Bewegung. Überwinde Hindernisse und
            entdecke neue Perspektiven.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 fade-up delay-300">
            <Link
              href="/training"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-neutral-900 font-semibold rounded-md hover:bg-neutral-100 transition-colors"
            >
              Training entdecken <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-md border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Probestunde buchen
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 md:divide-x divide-white/10">
          {[
            { value: stats.members, label: "Mitglieder" },
            { value: stats.years, label: "Jahre Erfahrung" },
            {
              value: stats.sessionsPerWeek,
              label: "Training pro Woche",
            },
            { value: stats.coaches, label: "Coaches" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="px-6 first:pl-0 last:pr-0 py-2 text-center md:text-left"
            >
              <div className="text-4xl font-black">{value}</div>
              <div className="text-sm text-white/50 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-4">
              Über uns
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
              Mehr als nur
              <br />
              Sport.
            </h2>
            <p className="mt-6 text-neutral-600 leading-relaxed text-lg">
              {about.text1}
            </p>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              {about.text2}
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-neutral-900 border-b-2 border-neutral-900 pb-0.5 hover:text-[#566246] hover:border-[#566246] transition-colors"
            >
              Komm vorbei <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src={framePng}
              alt="Parkour athlete in action"
              fill
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,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"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER ── */}
      <section className="bg-neutral-50 py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-4">
              Angebot
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
              Was wir bieten
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
            {[
              {
                number: "01",
                title: "Geleitetes Training",
                desc: "Strukturierte Einheiten mit erfahrenen Coaches. Für Anfänger und Fortgeschrittene.",
              },
              {
                number: "02",
                title: "Freies Training",
                desc: "Trainiere in deinem eigenen Tempo. Unsere Community ist immer da, um zu helfen.",
              },
              {
                number: "03",
                title: "Workshops & Events",
                desc: "Regelmässige Workshops und Community-Events – lerne neue Moves und neue Leute.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="bg-white p-8 md:p-10 group hover:bg-neutral-900 transition-colors duration-300"
              >
                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-white mb-3 transition-colors">
                  {item.title}
                </h3>
                <p className="text-neutral-600 group-hover:text-white/70 text-sm leading-relaxed transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-900 rounded-2xl px-10 py-16 md:px-20 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Bereit für dein
                <br />
                erstes Training?
              </h2>
              <p className="mt-4 text-white/60 max-w-md">
                Keine Vorkenntnisse erforderlich. Schreib uns kurz eine E-Mail
                und wir bestätigen den Termin.
              </p>
            </div>
            <Link
              href="/kontakt"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 font-bold rounded-md hover:bg-neutral-100 transition-colors text-base"
            >
              Jetzt anmelden <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <span className="font-semibold text-neutral-900">Parkour Baar</span>
          <div className="flex gap-6">
            <Link
              href="/training"
              className="hover:text-neutral-900 transition-colors"
            >
              Training
            </Link>
            <Link
              href="/kontakt"
              className="hover:text-neutral-900 transition-colors"
            >
              Kontakt
            </Link>
            <Link
              href="/login"
              className="hover:text-neutral-900 transition-colors"
            >
              Einloggen
            </Link>
          </div>
          <span>© {new Date().getFullYear()} Parkour Baar</span>
        </div>
      </footer>
    </>
  );
}
