"use client";
import styles from "~/styles/Leaderboard.module.scss";
import { DataTable } from "~/app/_components/tables/DataTable";
import { type Entry } from "~/server/api/routers/entry/read";
import { type ColumnDef } from "@tanstack/react-table";
import Modal from "~/app/_components/Modal";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { CreateEntry } from "~/app/_components/create-entry";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { cn } from "~/utils";

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
  {
    accessorKey: "peerReviewCount",
    header: "Peer Reviews",
    cell: ({ row }) => <div>{row.getValue("peerReviewCount")}</div>,
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
  session,
}: {
  entry: Entry;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  session: Session | null;
}) {
  const updateEntry = api.entry.peerReview.useMutation();
  const userHasPeerReviewed = entry.userEntries.some(
    (userEntry) =>
      userEntry.userId === session?.user.id && userEntry.hasReviewed,
  );
  return (
    <Modal setShowModal={setShowModal}>
      <h1 className="mb-4 text-2xl font-bold">{entry.term}</h1>
      <p className="mb-4">{entry.longDefinition}</p>
      <div className="flex flex-row gap-2">
        links:
        {entry.links.map((link) => (
          <a href={link} key={link}>
            {link}
          </a>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {entry.tags.map((tag) => (
          <div key={tag} className="rounded-md border border-black p-2">
            {tag}
          </div>
        ))}
      </div>
      {session?.user?.isVerified && (
        <div className="mt-4 flex gap-2">
          {/* TODO: Add edit and delete buttons */}
          {/* <button className="rounded-md border border-black p-2">Edit</button>
          <button className="rounded-md border border-black p-2">Delete</button> */}
          <button
            className={cn(
              "rounded-md border p-2",
              userHasPeerReviewed ? "border-red-500" : "border-green-500",
            )}
            onClick={() => {
              updateEntry.mutate({
                id: entry.id,
                hasBeenPeerReviewed: !userHasPeerReviewed,
              });
            }}
          >
            {userHasPeerReviewed ? "Revoke Review" : "Add Review"}
          </button>
        </div>
      )}
    </Modal>
  );
}

function VerificationRequestModal({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const createVerificationRequest =
    api.verificationRequest.create.useMutation();
  const [details, setDetails] = useState("");
  return (
    <Modal setShowModal={setShowModal}>
      <h1 className="mb-4 text-2xl font-bold">Request Verification</h1>
      <p className="mb-4">
        Please explain your qualifications/expertise in Solana
      </p>
      <input
        type="text"
        placeholder="Details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        className="mb-4 w-full rounded-md border border-solid border-black p-4 text-black"
      />
      <div className="mt-4 flex gap-2">
        <button
          className={cn("rounded-md border p-2", "border-green-500")}
          onClick={() => {
            createVerificationRequest.mutate({
              details,
            });
          }}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}

function EntryContent({
  entries,
  session,
}: {
  entries: Entry[] | undefined;
  session: Session | null;
}) {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showCreateEntryModal, setShowCreateEntryModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Entry[]>([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    const results = entries?.filter((entry) =>
      entry.term.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setSearchResults(results ?? []);
  }, [searchTerm, entries]);

  return (
    <div className={styles.content}>
      <div className={styles.innerContent}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full rounded-md border border-solid border-black p-4 text-black"
        />
        {session?.user && (
          <div>
            <button
              onClick={() => setShowCreateEntryModal(true)}
              className="mb-4"
            >
              Create Entry
            </button>
            {!session.user.isVerified &&
              !session.user.hasFailedVerification && (
                <button onClick={() => setShowVerifyModal(true)}>
                  Request Verification
                </button>
              )}
          </div>
        )}

        {entries && (
          <DataTable
            columns={columns}
            data={searchResults}
            onRowClick={(entry) => {
              setSelectedEntry(entry);
              setShowEntryModal(true);
            }}
          />
        )}
        {showEntryModal && selectedEntry && (
          <EntryModal
            entry={selectedEntry}
            setShowModal={setShowEntryModal}
            session={session}
          />
        )}

        {showCreateEntryModal && (
          <CreateEntryModal setShowModal={setShowCreateEntryModal} />
        )}
        {showVerifyModal && (
          <VerificationRequestModal setShowModal={setShowVerifyModal} />
        )}
      </div>
    </div>
  );
}

export { EntryContent };
