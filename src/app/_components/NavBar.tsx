"use client";

import { type Session } from "next-auth";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function Header({ session }: { session: Session | null }) {
  const seedDatabase = api.dev.seed.useMutation();
  return (
    <div className="header flex w-full flex-row items-center justify-between gap-2 border-b border-white px-4 py-4">
      <div className="flex items-center gap-2 text-xl text-black">
        <img src="/images/solLogo.png" alt="Solana Logo" className="h-8 w-8" />
        Solana Dictionary
        <div className="text-xs text-gray-500">BETA</div>
      </div>
      {session?.user.isAdmin && (
        <button onClick={() => seedDatabase.mutate()}>Seed Database</button>
      )}
      <AuthShowcase session={session} />
    </div>
  );
}

function AuthShowcase({ session }: { session: Session | null }) {
  return (
    <div className="relative mx-4 inline-block text-left">
      <div>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
    </div>
  );
}
