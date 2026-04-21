import { Navigation } from '@/components/Navigation'
import Link from 'next/link'
import { Mail, MapPin, Clock } from 'lucide-react'
import { getSiteData } from '@/lib/site-data'
import { KontaktClient } from './KontaktClient'

export default async function KontaktPage() {
    const { contact, training } = await getSiteData()

    return (
        <>
            <Navigation />

            <section className="pt-32 pb-16 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-4">Kontakt</p>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-neutral-900 leading-none">
                        Wir freuen uns<br />von dir zu hören.
                    </h1>
                </div>
            </section>

            <section className="pb-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <KontaktClient email={contact.email} />

                    <div className="border border-neutral-200 rounded-2xl p-10 space-y-8">
                        <div className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">Infos</div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-neutral-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">E-Mail</div>
                                    <a href={`mailto:${contact.email}`} className="text-neutral-900 font-medium hover:text-[#566246] transition-colors">
                                        {contact.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-neutral-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Trainingsort</div>
                                    <div className="text-neutral-900 font-medium text-sm">{training.location}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Clock className="w-4 h-4 text-neutral-600" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Trainingszeiten</div>
                                    <div className="text-neutral-900 font-medium text-sm space-y-0.5">
                                        {training.sessions.map(s => (
                                            <div key={s.id}>{s.day} · {s.time}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {contact.socials.length > 0 && (
                            <div className="border-t border-neutral-100 pt-6 flex flex-wrap gap-3">
                                {contact.socials.map(s => (
                                    <a
                                        key={s.id}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-md text-sm font-semibold hover:bg-neutral-900 hover:text-white transition-colors"
                                    >
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-24 bg-white">
                <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden border border-neutral-200">
                    <iframe
                        title="Trainingsort Baar"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2716.1!2d8.526448!3d47.1908863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479aab0a08ea9875%3A0xc3e4ce854d95c5e8!2sParkour%20Baar!5e0!3m2!1sde!2sch!4v1716000000000"
                        width="100%"
                        height="320"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </section>

            <footer className="border-t border-neutral-200 py-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
                    <span className="font-semibold text-neutral-900">Parkour Baar</span>
                    <div className="flex gap-6">
                        <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
                        <Link href="/training" className="hover:text-neutral-900 transition-colors">Training</Link>
                    </div>
                    <span>© {new Date().getFullYear()} Parkour Baar</span>
                </div>
            </footer>
        </>
    )
}
