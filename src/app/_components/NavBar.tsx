import { type Session } from "next-auth";
import Link from "next/link";

export default function Header({ session }: { session: Session | null }) {
  return (
    <div className="header flex w-full flex-row items-center justify-between gap-2 border-b border-white px-4 py-4">
      <div className="text-xl text-black">Solana Dictionary</div>

      <AuthShowcase session={session} />
    </div>
  );
}

async function AuthShowcase({ session }: { session: Session | null }) {
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
