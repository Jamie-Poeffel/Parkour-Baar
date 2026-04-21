import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { getSiteData } from '@/lib/site-data';

export default async function Home() {
    const { about, stats } = await getSiteData()

    return (
        <>
            <Navigation />

            {/* ── HERO ── */}
            <section className="relative h-screen min-h-[600px] flex items-end">
                <Image
                    src="https://images.unsplash.com/photo-1554889914-a5c84570ea3e?auto=format&fit=crop&w=1920&q=85"
                    alt="Parkour athlete backflip"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-28">
                    <p className="text-sm font-semibold tracking-[0.2em] uppercase text-white/60 mb-4 fade-up">
                        Sportclub · Baar, Schweiz
                    </p>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter fade-up delay-100">
                        Parkour<br />Baar
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-white/75 max-w-md leading-relaxed fade-up delay-200">
                        Lerne die Kunst der effizienten Bewegung. Überwinde Hindernisse und entdecke neue Perspektiven.
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
                <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                    {[
                        { value: stats.members,         label: "Mitglieder" },
                        { value: stats.years,           label: "Jahre Erfahrung" },
                        { value: stats.sessionsPerWeek, label: "Training pro Woche" },
                        { value: stats.coaches,         label: "Coaches" },
                    ].map(({ value, label }) => (
                        <div key={label} className="px-6 first:pl-0 last:pr-0 py-2 text-center md:text-left">
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
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-4">Über uns</p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
                            Mehr als nur<br />Sport.
                        </h2>
                        <p className="mt-6 text-neutral-600 leading-relaxed text-lg">{about.text1}</p>
                        <p className="mt-4 text-neutral-600 leading-relaxed">{about.text2}</p>
                        <Link
                            href="/kontakt"
                            className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-neutral-900 border-b-2 border-neutral-900 pb-0.5 hover:text-[#566246] hover:border-[#566246] transition-colors"
                        >
                            Komm vorbei <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1602424845444-60c87a5bb0fb?auto=format&fit=crop&w=900&q=85"
                            alt="Parkour athlete in action"
                            fill
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
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-4">Angebot</p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
                            Was wir bieten
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
                        {[
                            { number: "01", title: "Geleitetes Training",   desc: "Strukturierte Einheiten mit erfahrenen Coaches. Für Anfänger und Fortgeschrittene." },
                            { number: "02", title: "Freies Training",       desc: "Trainiere in deinem eigenen Tempo. Unsere Community ist immer da, um zu helfen." },
                            { number: "03", title: "Workshops & Events",    desc: "Regelmässige Workshops und Community-Events – lerne neue Moves und neue Leute." },
                        ].map((item) => (
                            <div key={item.number} className="bg-white p-8 md:p-10 group hover:bg-neutral-900 transition-colors duration-300">
                                <div className="text-xs font-bold text-neutral-400 group-hover:text-white/40 mb-6 transition-colors">{item.number}</div>
                                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-white mb-3 transition-colors">{item.title}</h3>
                                <p className="text-neutral-600 group-hover:text-white/70 text-sm leading-relaxed transition-colors">{item.desc}</p>
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
                                Bereit für dein<br />erstes Training?
                            </h2>
                            <p className="mt-4 text-white/60 max-w-md">
                                Kostenlose Probestunde. Keine Vorkenntnisse erforderlich. Einfach vorbeikommen.
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
                        <Link href="/training" className="hover:text-neutral-900 transition-colors">Training</Link>
                        <Link href="/kontakt" className="hover:text-neutral-900 transition-colors">Kontakt</Link>
                        <Link href="/login" className="hover:text-neutral-900 transition-colors">Einloggen</Link>
                    </div>
                    <span>© {new Date().getFullYear()} Parkour Baar</span>
                </div>
            </footer>
        </>
    );
}
