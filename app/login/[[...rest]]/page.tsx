import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left — branding panel */}
      <div className="hidden md:flex flex-col justify-between bg-neutral-900 p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/light_icon.png"
            alt="Parkour Baar"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="font-bold text-white tracking-tight">
            Parkour Baar
          </span>
        </Link>
        <div>
          <blockquote className="text-white/80 text-xl leading-relaxed font-medium">
            "Be strong to be useful."
          </blockquote>
          <cite className="mt-3 block text-sm text-white/40 not-italic">
            — Georges Hébert
          </cite>
        </div>
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} Parkour Baar
        </p>
      </div>

      {/* Right — Clerk SignIn */}
      <div className="flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full flex flex-col items-center">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 md:hidden">
            <Image
              src="/dark_icon.png"
              alt="Parkour Baar"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="font-bold text-neutral-900 text-sm">
              Parkour Baar
            </span>
          </Link>

          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full max-w-sm",
                card: "shadow-none border border-neutral-200 rounded-xl p-8",
                headerTitle:
                  "text-2xl font-black text-neutral-900 tracking-tight",
                headerSubtitle: "text-sm text-neutral-500",
                formButtonPrimary:
                  "bg-neutral-900 hover:bg-neutral-700 text-white font-semibold h-11 rounded-md",
                formFieldInput:
                  "h-11 border-neutral-200 rounded-md text-sm focus:ring-neutral-900",
                formFieldLabel: "text-sm font-medium text-neutral-700",
                footerActionLink:
                  "text-[#566246] hover:text-[#3d4733] font-medium",
                identityPreviewText: "text-sm text-neutral-700",
                socialButtonsBlockButton:
                  "border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-medium",
              },
              variables: {
                colorPrimary: "#0a0a0a",
                colorText: "#0a0a0a",
                borderRadius: "0.5rem",
                fontFamily: "var(--font-sans)",
              },
            }}
          />

          <p className="mt-6 text-center text-xs text-neutral-400">
            <Link href="/" className="hover:text-neutral-700 transition-colors">
              ← Zurück zur Website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
