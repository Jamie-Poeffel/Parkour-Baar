import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { getSiteData } from "@/lib/site-data"
import { LogOut, MapPin, Clock, Mail, User, LayoutDashboard } from "lucide-react"

export default async function MitgliederPage() {
    const { userId } = await auth()
    if (!userId) redirect("/login")

    const user = await currentUser()
    const isAdmin = user?.publicMetadata?.role === "admin"
    const { training, contact } = await getSiteData()

    const initials = user?.firstName && user?.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`
        : (user?.emailAddresses[0]?.emailAddress?.[0] ?? "?").toUpperCase()

    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ")
        || user?.emailAddresses[0]?.emailAddress
        || "Mitglied"

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2.5">
                            <Image src="/dark_icon.png" alt="Parkour Baar" width={24} height={24} className="object-contain" />
                            <span className="font-bold text-neutral-900 tracking-tight">Parkour Baar</span>
                        </Link>
                        {isAdmin && (
                            <>
                                <span className="text-neutral-300">·</span>
                                <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                            </>
                        )}
                    </div>
                    <SignOutButton redirectUrl="/">
                        <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                            <LogOut className="w-4 h-4" /> Abmelden
                        </button>
                    </SignOutButton>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
                {/* Profile card */}
                <div className="bg-white rounded-xl border border-neutral-200 p-8 flex items-center gap-6">
                    {user?.imageUrl ? (
                        <Image
                            src={user.imageUrl}
                            alt={fullName}
                            width={64}
                            height={64}
                            className="rounded-full object-cover shrink-0"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                            <span className="text-white font-bold text-xl">{initials}</span>
                        </div>
                    )}
                    <div>
                        <h1 className="text-xl font-black text-neutral-900 tracking-tight">{fullName}</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">{user?.emailAddresses[0]?.emailAddress}</p>
                        <span className={`mt-2 inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                            isAdmin ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                            {isAdmin ? "Admin" : "Mitglied"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Training schedule */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Clock className="w-4 h-4 text-neutral-400" />
                            <h2 className="font-bold text-neutral-900">Trainingszeiten</h2>
                        </div>
                        <div className="space-y-3">
                            {training.sessions.map(s => (
                                <div key={s.id} className="flex items-center justify-between text-sm py-2 border-b border-neutral-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-neutral-900 w-24">{s.day}</span>
                                        <span className="text-neutral-500">{s.time}</span>
                                    </div>
                                    <span className="text-xs text-neutral-400">{s.level}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-start gap-1.5 text-xs text-neutral-400">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            {training.location}
                        </div>
                    </div>

                    {/* Contact & links */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-5">
                                <Mail className="w-4 h-4 text-neutral-400" />
                                <h2 className="font-bold text-neutral-900">Kontakt</h2>
                            </div>
                            <a
                                href={`mailto:${contact.email}`}
                                className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors font-medium"
                            >
                                {contact.email}
                            </a>
                            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                                Bei Fragen, Absenzen oder sonstigen Anliegen schreib uns einfach eine E-Mail.
                            </p>
                        </div>

                        {contact.socials.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-3">
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

                {/* Account actions */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <User className="w-4 h-4 text-neutral-400" />
                        <h2 className="font-bold text-neutral-900">Konto</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/user-profile"
                            className="px-4 py-2.5 border border-neutral-200 text-neutral-700 rounded-md text-sm font-semibold hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
                        >
                            Profil bearbeiten
                        </Link>
                        <SignOutButton redirectUrl="/">
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors">
                                <LogOut className="w-4 h-4" /> Abmelden
                            </button>
                        </SignOutButton>
                    </div>
                </div>
            </main>
        </div>
    )
}
