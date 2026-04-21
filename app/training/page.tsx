import { Navigation } from '@/components/Navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, MapPin } from 'lucide-react'
import { getSiteData } from '@/lib/site-data'

export default async function TrainingPage() {
    const { training, techniques } = await getSiteData()

    return (
        <>
            <Navigation />

            <section className="pt-32 pb-16 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-4">Training</p>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-neutral-900 leading-none">
                        So trainieren<br />wir.
                    </h1>
                    <p className="mt-6 text-lg text-neutral-600 max-w-xl leading-relaxed">
                        Strukturierte Einheiten für alle Levels – von der ersten Rolle bis zum fortgeschrittenen Freestyle.
                    </p>
                </div>
            </section>

            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto relative h-72 md:h-[480px] rounded-2xl overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1569698045292-e14cb5393e79?auto=format&fit=crop&w=1400&q=85"
                        alt="Parkour training"
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center px-10">
                        <blockquote className="text-white max-w-sm">
                            <p className="text-2xl md:text-3xl font-bold leading-snug">"Be strong to be useful."</p>
                            <cite className="mt-3 block text-sm text-white/60 not-italic">— Georges Hébert</cite>
                        </blockquote>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-neutral-50">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-3">Wochenplan</p>
                        <h2 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">Trainingszeiten</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {training.sessions.map((s) => (
                            <div key={s.id} className="bg-white border border-neutral-200 rounded-xl p-6 flex items-start justify-between gap-4 hover:border-neutral-400 transition-colors">
                                <div>
                                    <div className="text-lg font-bold text-neutral-900">{s.day}</div>
                                    <div className="flex items-center gap-1.5 text-neutral-500 mt-1 text-sm">
                                        <Clock className="w-3.5 h-3.5" />
                                        {s.time}
                                    </div>
                                    <div className="text-xs text-neutral-400 mt-1">{s.note}</div>
                                </div>
                                <span className="shrink-0 text-xs font-semibold px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full">
                                    {s.level}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <MapPin className="w-4 h-4 shrink-0 text-neutral-400" />
                        {training.location}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-3">Curriculum</p>
                        <h2 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">Was du lernst</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
                        {(techniques ?? []).map((t) => (
                            <div key={t.id} className="bg-white p-6 hover:bg-neutral-900 group transition-colors duration-200">
                                <h3 className="font-bold text-neutral-900 group-hover:text-white mb-1 transition-colors">{t.name}</h3>
                                <p className="text-sm text-neutral-500 group-hover:text-white/60 transition-colors">{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-neutral-50">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-neutral-900 rounded-2xl px-10 py-16 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Kostenlose Probestunde</h2>
                            <p className="mt-3 text-white/60">Keine Anmeldung, keine Vorkenntnisse. Einfach vorbeikommen.</p>
                        </div>
                        <Link href="/kontakt" className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-white text-neutral-900 font-bold rounded-md hover:bg-neutral-100 transition-colors">
                            Jetzt anmelden <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="border-t border-neutral-200 py-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
                    <span className="font-semibold text-neutral-900">Parkour Baar</span>
                    <div className="flex gap-6">
                        <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
                        <Link href="/kontakt" className="hover:text-neutral-900 transition-colors">Kontakt</Link>
                    </div>
                    <span>© {new Date().getFullYear()} Parkour Baar</span>
                </div>
            </footer>
        </>
    )
}
