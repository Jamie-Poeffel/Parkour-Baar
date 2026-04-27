"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function SignOutBtn() {
  const { signOut } = useClerk();
  return (
    <button
      onClick={() => signOut({ redirectUrl: "/" })}
      className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors"
    >
      <LogOut className="w-4 h-4" /> Abmelden
    </button>
  );
}
