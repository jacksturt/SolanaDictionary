import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
export default function Header() {
  return (
    <div className="header bg-black-500 flex w-full flex-row items-center justify-end gap-2 border-b border-white px-4 py-4">
      <div className="text-xl text-white"> Solana Dictionary</div>

      <AuthShowcase />
    </div>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      //onMouseLeave={handleMouseLeave}
      className="relative mx-4 inline-block text-left"
    >
      <div>
        {sessionData && sessionData.user.image ? (
          <button className="rounded-full border border-white text-sm font-semibold text-white no-underline transition hover:border-white/50 hover:bg-white/20 hover:text-white/50 focus:outline-none">
            <Image
              width={44}
              height={44}
              src={sessionData.user.image}
              alt="profile image"
              className="overflow-hidden rounded-full"
            />
          </button>
        ) : (
          <button onClick={() => void signIn()}>Sign In</button>
        )}

        {isDropdownOpen && sessionData && (
          <div
            onMouseLeave={handleMouseLeave}
            className="absolute right-0 z-50 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <div>
              <button
                onClick={
                  sessionData ? () => void signOut() : () => void signIn()
                }
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
