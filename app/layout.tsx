import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { getSiteData } from "@/utils/site-data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parkour Baar",
  description:
    "Parkour Club in Baar - professionelles Training für alle Levels",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getSiteData();
  const partners = data.partners ?? [];

  return (
    <ClerkProvider dynamic>
      <html lang="de" className={inter.variable} suppressHydrationWarning>
        <body className="antialiased">
          {children}
          <footer className="py-8 border-t border-neutral-100">
            {partners.length > 0 && (
              <div className="max-w-5xl mx-auto px-6 mb-6">
                <p className="text-xs text-neutral-400 text-center uppercase tracking-widest mb-4">
                  Partner
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  {partners.map((p) =>
                    p.websiteUrl ? (
                      <a
                        key={p.id}
                        href={p.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={p.name}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                      >
                        {p.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.logoUrl}
                            alt={p.name}
                            className="h-8 w-auto object-contain"
                          />
                        ) : (
                          <span className="text-sm text-neutral-500 font-medium">
                            {p.name}
                          </span>
                        )}
                      </a>
                    ) : (
                      <span key={p.id} className="opacity-60" title={p.name}>
                        {p.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.logoUrl}
                            alt={p.name}
                            className="h-8 w-auto object-contain"
                          />
                        ) : (
                          <span className="text-sm text-neutral-500 font-medium">
                            {p.name}
                          </span>
                        )}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
            <p className="text-center">
              <span className="text-xs font-mono text-neutral-400">
                v{process.env.NEXT_PUBLIC_APP_VERSION}
              </span>
            </p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
