import { UserProfile } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default async function UserProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
          <Image
            src="/dark_icon.png"
            alt="Parkour Baar"
            width={24}
            height={24}
            className="object-contain"
          />
          <Link
            href="/mitglieder"
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück
          </Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-10 flex justify-center">
        <UserProfile
          appearance={{
            elements: {
              card: "shadow-none border border-neutral-200 rounded-xl",
              navbar: "border-r border-neutral-200",
              navbarButton__active: "text-neutral-900 font-semibold",
            },
            variables: {
              colorPrimary: "#0a0a0a",
              borderRadius: "0.5rem",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </div>
    </div>
  );
}
