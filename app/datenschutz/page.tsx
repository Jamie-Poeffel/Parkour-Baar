import { Navigation } from "@/components/Navigation";
import Link from "next/link";

export const metadata = {
    title: "Datenschutz – Parkour Baar",
    description: "Datenschutzerklärung von Parkour Baar",
};

export default function DatenschutzPage() {
    return (
        <>
            <Navigation />

            <section className="pt-32 pb-16 px-6 bg-white">
                <div className="max-w-3xl mx-auto">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-4">
                        Rechtliches
                    </p>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-neutral-900 leading-none">
                        Datenschutz.
                    </h1>
                </div>
            </section>

            <section className="pb-24 px-6">
                <div className="max-w-3xl mx-auto space-y-10 text-neutral-700 leading-relaxed">

                    <div>
                        <h2 className="text-xl font-black text-neutral-900 mb-3">1. Verantwortlicher</h2>
                        <p>
                            Parkour Baar<br />
                            Baar, Schweiz<br />
                            Kontakt: <Link href="/kontakt" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">parkourbaar.ch/kontakt</Link>
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-black text-neutral-900 mb-3">2. Cookies & Tracking</h2>
                        <p>
                            Wir setzen Cookies und ähnliche Technologien nur nach deiner ausdrücklichen Zustimmung ein.
                            Du kannst deine Einwilligung jederzeit widerrufen, indem du den Browserspeicher
                            (localStorage) löschst oder unsere Website in einem privaten Fenster öffnest.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-black text-neutral-900 mb-3">3. Google Analytics</h2>
                        <p>
                            Mit deiner Zustimmung verwenden wir Google Analytics 4 (Google LLC, USA), um anonymisierte
                            Nutzungsstatistiken zu erheben (besuchte Seiten, Verweildauer, ungefähre Herkunft).
                            Es werden keine personenbezogenen Daten ohne Einwilligung weitergegeben.
                            Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">policies.google.com/privacy</a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-black text-neutral-900 mb-3">4. LogRocket</h2>
                        <p>
                            Mit deiner Zustimmung nutzen wir LogRocket (LogRocket Inc., USA) zur
                            Session-Aufzeichnung und Fehleranalyse. LogRocket kann Interaktionen auf der Website
                            aufzeichnen, um technische Probleme zu beheben. Weitere Informationen:{" "}
                            <a href="https://logrocket.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">logrocket.com/privacy</a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-black text-neutral-900 mb-3">5. Hosting</h2>
                        <p>
                            Diese Website wird über Vercel (Vercel Inc., USA) gehostet. Beim Aufruf der Website
                            werden technisch notwendige Daten (IP-Adresse, Browser, Zeitstempel) vorübergehend
                            in Server-Logs gespeichert. Weitere Informationen:{" "}
                            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">vercel.com/legal/privacy-policy</a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-black text-neutral-900 mb-3">6. Authentifizierung</h2>
                        <p>
                            Für den geschlossenen Mitgliederbereich verwenden wir Clerk (Clerk Inc., USA).
                            Dabei werden E-Mail-Adresse und Name verarbeitet. Weitere Informationen:{" "}
                            <a href="https://clerk.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">clerk.com/legal/privacy</a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-black text-neutral-900 mb-3">7. Deine Rechte</h2>
                        <p>
                            Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
                            Verarbeitung deiner Daten sowie das Recht auf Datenübertragbarkeit.
                            Wende dich dazu an uns über die{" "}
                            <Link href="/kontakt" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">Kontaktseite</Link>.
                        </p>
                    </div>

                    <p className="text-sm text-neutral-400 pt-4 border-t border-neutral-100">
                        Stand: {new Date().toLocaleDateString("de-CH", { month: "long", year: "numeric" })}
                    </p>
                </div>
            </section>
        </>
    );
}
