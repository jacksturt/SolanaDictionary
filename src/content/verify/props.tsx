import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export async function getServerSideProps() {
  "use server";
  const session = await getServerAuthSession();
  const verificationRequests = await api.verificationRequest.read(); // Ensure this is callable server-side

  // Check if user is not admin
  if (!session?.user?.isAdmin) {
    return { props: {} }; // Optionally redirect or handle non-admin access
  }

  return {
    props: { session, verificationRequests }, // Pass session and verificationRequests as props
  };
}
