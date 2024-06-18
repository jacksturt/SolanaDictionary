"use client";
import styles from "@/styles/Leaderboard.module.scss";
import { DataTable } from "~/app/_components/tables/DataTable";
import { Entry } from "~/server/api/routers/entry/read";
import { ColumnDef } from "@tanstack/react-table";
import Modal from "~/app/_components/Modal";
import { Dispatch, SetStateAction, useState } from "react";
import { CreateEntry } from "~/pages/main/create-entry";
import { useSession } from "next-auth/react";
const columns: ColumnDef<Entry>[] = [
  {
    accessorKey: "term",
    header: "Term",
  },
  {
    accessorKey: "definition",
    header: "Definition",
    cell: ({ row }) => <div>{row.getValue("definition")}</div>,
  },
];

function CreateEntryModal({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal setShowModal={setShowModal}>
      <CreateEntry />
    </Modal>
  );
}

function EntryModal({
  entry,
  setShowModal,
}: {
  entry: Entry;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal setShowModal={setShowModal}>
      <h1>{entry.term}</h1>
      <p>{entry.definition}</p>
    </Modal>
  );
}

function EntryContent({ entries }: { entries: Entry[] | undefined }) {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showCreateEntryModal, setShowCreateEntryModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const { data: session } = useSession();
  return (
    <div className={styles.content}>
      <div className={styles.innerContent}>
        <h1 className={styles.heading}>Solana Dictionary</h1>
        {session?.user && session.user.isAdmin && (
          <button onClick={() => setShowCreateEntryModal(true)}>
            Create Entry
          </button>
        )}

        {entries && (
          <DataTable
            columns={columns}
            data={entries}
            onRowClick={(entry) => {
              setSelectedEntry(entry);
              setShowEntryModal(true);
            }}
          />
        )}
        {showEntryModal && selectedEntry && (
          <EntryModal entry={selectedEntry} setShowModal={setShowEntryModal} />
        )}

        {showCreateEntryModal && (
          <CreateEntryModal setShowModal={setShowCreateEntryModal} />
        )}
      </div>
    </div>
  );
}

export { EntryContent };
