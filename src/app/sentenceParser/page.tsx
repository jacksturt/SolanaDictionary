import styles from "~/styles/Leaderboard.module.scss";
import { SentenceParserContent } from "~/content/sentenceParser/content";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import NavBar from "~/app/_components/NavBar";

async function SentenceParser() {
  const session = await getServerAuthSession();

  return (
    <div className={styles.main}>
      <NavBar session={session} />
      <SentenceParserContent />
    </div>
  );
}

export default SentenceParser;
