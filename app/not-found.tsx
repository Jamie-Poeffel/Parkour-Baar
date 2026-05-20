import Link from "next/link";
import { Navigation } from "@/components/Navigation";

export default function NotFound() {
    return (
        <>
            <Navigation />
            <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-4">
                    Fehler 404
                </p>
                <h1 className="text-7xl md:text-9xl font-black tracking-tight text-neutral-900 leading-none mb-6">
                    404
                </h1>
                <p className="text-lg text-neutral-500 max-w-sm mb-10">
                    Diese Seite existiert nicht oder wurde verschoben.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-semibold rounded-md hover:bg-neutral-700 transition-colors"
                >
                    Zurück zur Startseite
                </Link>
            </section>
        </>
    );
}
