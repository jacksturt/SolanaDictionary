import styles from "@/styles/Leaderboard.module.scss";
import { EntryContent } from "./content";
import { api } from "~/trpc/react";

async function Entries() {
  // table data
  const entries = api.entry.read.useQuery();

  return (
    <div className={styles.main}>
      <EntryContent entries={entries.data} />
    </div>
  );
}

export default Entries;
