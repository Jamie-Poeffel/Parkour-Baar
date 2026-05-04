import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
      <html lang="de" className={inter.variable} suppressHydrationWarning>
        <body className="antialiased">
          {children}
          <footer className="text-center py-4">
            <span className="text-xs font-mono text-neutral-400">
              v{process.env.NEXT_PUBLIC_APP_VERSION}
            </span>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
