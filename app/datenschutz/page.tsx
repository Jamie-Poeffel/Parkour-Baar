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
            <h2 className="text-xl font-black text-neutral-900 mb-3">
              1. Verantwortlicher
            </h2>
            <p>
              Parkour Baar
              <br />
              Baar, Schweiz
              <br />
              Kontakt:{" "}
              <Link
                href="/kontakt"
                className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
              >
                Kontaktseite
              </Link>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-3">
              2. Erhebung und Verarbeitung von Daten
            </h2>
            <p>
              Beim Besuch unserer Website können technische Daten wie
              IP-Adresse, Zeitpunkt des Zugriffs, Browserinformationen und
              aufgerufene Seiten verarbeitet werden. Diese Daten dienen dem
              technischen Betrieb, der Sicherheit und der Fehleranalyse unserer
              Website. Wir verarbeiten personenbezogene Daten nur im Rahmen der
              geltenden Datenschutzbestimmungen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-3">
              3. Hosting und Bereitstellung
            </h2>
            <p>
              Unsere Website wird auf der Oracle Cloud Infrastructure (OCI)
              betrieben. Cloudflare wird als vorgelagerter Dienst für die
              Bereitstellung und Absicherung der Website eingesetzt.
            </p>
            <p className="mt-3">
              Im Rahmen dieser Dienste können technische Verbindungsdaten,
              insbesondere IP-Adressen und Informationen zu Anfragen,
              verarbeitet werden. Dabei können Daten auch durch die jeweiligen
              Dienstleister verarbeitet werden. Weitere Informationen findest du
              in den{" "}
              <a
                href="https://www.oracle.com/legal/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
              >
                Datenschutzinformationen von Oracle
              </a>{" "}
              und der{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
              >
                Datenschutzerklärung von Cloudflare
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-3">
              4. Server-Logging und Fehleranalyse
            </h2>
            <p>
              Zur Überwachung des technischen Betriebs und zur Analyse von
              Fehlern verwenden wir Axiom. Dabei können technische Ereignisse,
              Fehlermeldungen, Zeitstempel und weitere in den Protokollen
              enthaltene Informationen verarbeitet werden. Personenbezogene
              Daten können betroffen sein, sofern sie in solchen Protokollen
              enthalten sind.
            </p>
            <p className="mt-3">
              Weitere Informationen findest du in der{" "}
              <a
                href="https://axiom.co/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
              >
                Datenschutzerklärung von Axiom
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-3">
              5. Authentifizierung und Mitgliederbereich
            </h2>
            <p>
              Für die Anmeldung und den geschützten Mitgliederbereich verwenden
              wir Clerk. Im Rahmen der Authentifizierung können insbesondere
              E-Mail-Adressen, Namen und technische Authentifizierungsdaten
              verarbeitet werden.
            </p>
            <p className="mt-3">
              Weitere Informationen findest du in der{" "}
              <a
                href="https://clerk.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
              >
                Datenschutzerklärung von Clerk
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-3">
              6. Webanalyse
            </h2>
            <p>
              Mit deiner Einwilligung (Cookie-Banner) verwenden wir Google
              Analytics, um die Nutzung der Website statistisch auszuwerten.
              Dabei können IP-Adressen, Geräte- und Browserinformationen sowie
              aufgerufene Seiten an Google übermittelt werden. Ohne
              Einwilligung wird Google Analytics nicht geladen. Weitere
              Informationen findest du in der{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
              >
                Datenschutzerklärung von Google
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-3">
              7. Cookies und lokaler Speicher
            </h2>
            <p>
              Unsere Website kann Cookies und lokale Speichermechanismen
              verwenden, beispielsweise für die Anmeldung, die Verwaltung von
              Sitzungen oder gespeicherte Einstellungen. Welche Technologien
              tatsächlich eingesetzt werden, hängt von den verwendeten
              Funktionen ab. Nicht notwendige Tracking- oder
              Analyse-Technologien werden nur eingesetzt, sofern die
              erforderliche Rechtsgrundlage und gegebenenfalls eine Einwilligung
              vorliegen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-neutral-900 mb-3">
              8. Deine Rechte
            </h2>
            <p>
              Im Rahmen des anwendbaren Datenschutzrechts hast du insbesondere
              Rechte auf Auskunft und, sofern die gesetzlichen Voraussetzungen
              erfüllt sind, Berichtigung, Löschung und Einschränkung der
              Bearbeitung deiner personenbezogenen Daten. Du kannst dich mit
              entsprechenden Anliegen über unsere{" "}
              <Link
                href="/kontakt"
                className="underline underline-offset-2 hover:text-neutral-900 transition-colors"
              >
                Kontaktseite
              </Link>{" "}
              an uns wenden.
            </p>
          </div>

          <p className="text-sm text-neutral-400 pt-4 border-t border-neutral-100">
            Stand: Oktober 2026
          </p>
        </div>
      </section>
    </>
  );
}
