"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, Users } from "lucide-react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { hasPermission } from "@/lib/permissions";

export function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded, sessionClaims } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const isHero = pathname === "/";

  // Check role from session claims (if session token is customized in Clerk dashboard)
  // or fall back to publicMetadata on the full user object
  const roleFromClaims = (
    sessionClaims?.publicMetadata as { role?: string } | undefined
  )?.role;
  const roleFromUser = user?.publicMetadata?.role as string | undefined;
  const role = roleFromClaims ?? roleFromUser;
  const isAdmin =
    isLoaded && isSignedIn && hasPermission(role, "dashboard:access");

  useEffect(() => {
    if (!isHero) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHero]);

  const transparent = isHero && !scrolled && !menuOpen;

  const navLinks = [
    { href: "/", label: "Home", active: pathname === "/" },
    {
      href: "/training",
      label: "Training",
      active: pathname.startsWith("/training"),
    },
    {
      href: "/kontakt",
      label: "Kontakt",
      active: pathname.startsWith("/kontakt"),
    },
  ];

  const linkCls = (active: boolean) =>
    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      transparent
        ? `text-white/90 hover:text-white hover:bg-white/10 ${active ? "text-white font-semibold" : ""}`
        : `text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 ${active ? "text-neutral-900 font-semibold" : ""}`
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-white border-b border-neutral-200 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src={transparent ? "/light_icon.png" : "/dark_icon.png"}
            alt="Parkour Baar"
            width={28}
            height={28}
            priority
            className="object-contain"
          />
          <span
            className={`font-bold tracking-tight text-base transition-colors ${transparent ? "text-white" : "text-neutral-900"}`}
          >
            Parkour Baar
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, active }) => (
            <Link key={href} href={href} className={linkCls(active)}>
              {label}
            </Link>
          ))}

          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-2 ml-3">
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                    transparent
                      ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
              )}
              <Link
                href="/mitglieder"
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                  transparent
                    ? "bg-white text-neutral-900 hover:bg-neutral-100"
                    : "bg-neutral-900 text-white hover:bg-neutral-700"
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Mein Bereich
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className={`ml-3 px-5 py-2 text-sm font-semibold rounded-md transition-all hover:scale-105 ${
                transparent
                  ? "bg-white text-neutral-900 hover:bg-neutral-100"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
              }`}
            >
              Einloggen
            </Link>
          )}
        </nav>

        {/* Mobile */}
        <button
          className={`md:hidden p-2 rounded-md transition-colors ${transparent ? "text-white hover:bg-white/10" : "text-neutral-900 hover:bg-neutral-100"}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Menü"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          {navLinks.map(({ href, label, active }) => (
            <Link
              key={href}
              href={href}
              className={`block px-6 py-4 text-base border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${active ? "font-semibold text-neutral-900" : "text-neutral-600"}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="px-6 py-4 space-y-2">
            {isLoaded && isSignedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className="block w-full py-3 border border-neutral-200 text-neutral-700 font-semibold rounded-md text-center hover:bg-neutral-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/mitglieder"
                  className="block w-full py-3 bg-neutral-900 text-white font-semibold rounded-md text-center hover:bg-neutral-700 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Mein Bereich
                </Link>
                <button
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="w-full py-3 border border-neutral-200 text-neutral-600 font-semibold rounded-md text-center hover:bg-neutral-50 transition-colors"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full py-3 bg-neutral-900 text-white font-semibold rounded-md text-center hover:bg-neutral-700 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Einloggen
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
