import styles from "~/styles/Leaderboard.module.scss";
import { VerifyContent } from "~/content/verify";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import NavBar from "~/app/_components/NavBar";

async function Verify() {
  // table data
  const verificationRequests = await api.verificationRequest.read();
  const session = await getServerAuthSession();

  return (
    <div className={styles.main}>
      <NavBar session={session} />
      <VerifyContent verificationRequests={verificationRequests} />
    </div>
  );
}

export default Verify;
