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
import { Prisma } from "@prisma/client";
import { ExternalLink } from "~/types";

const columns: ColumnDef<Entry>[] = [
  {
    accessorKey: "term",
    header: "Term",
    cell: ({ row }) => (
      <div>{`${row.getValue("term")} ${row.original.acronym ? `(${row.original.acronym})` : ""}`}</div>
    ),
  },
  {
    accessorKey: "definition",
    header: "Definition",
    cell: ({ row }) => <div>{row.getValue("definition")}</div>,
  },
  {
    accessorKey: "peerReviewCount",
    header: "Peer Reviews",
    cell: ({ row }) => (
      <div>
        {
          row.original.userEntries.filter((userEntry) => userEntry.hasReviewed)
            .length
        }
      </div>
    ),
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
  const [editing, setEditing] = useState(false);
  const [editingTerm, setEditingTerm] = useState(entry.term);
  const [editingDefinition, setEditingDefinition] = useState(entry.definition);
  const [editingLongDefinition, setEditingLongDefinition] = useState(
    entry.longDefinition ?? "",
  );
  const [editingLinks, setEditingLinks] = useState(
    entry.links as ExternalLink[],
  );
  const [editingTags, setEditingTags] = useState(entry.tags);
  const updateEntry = api.entry.peerReview.useMutation();
  const userHasPeerReviewed = entry.userEntries.some(
    (userEntry) =>
      userEntry.userId === session?.user.id && userEntry.hasReviewed,
  );

  const createEntryRevision = api.entryRevision.create.useMutation({
    onSuccess: () => {
      setEditing(false);
    },
  });
  return (
    <Modal setShowModal={setShowModal}>
      {!editing ? (
        <>
          <h1 className="mb-4 text-2xl font-bold">{editingTerm}</h1>
          <p className="mb-4">{editingLongDefinition}</p>
          {editingLinks && editingLinks.length > 0 && (
            <div className="flex flex-col gap-2">
              <div>links:</div>
              {editingLinks.map((link) => (
                <a href={link.url} key={link.url} className="text-blue-500">
                  {link.title}
                </a>
              ))}
            </div>
          )}
          <div className="mt-4 flex gap-2">
            {editingTags.map((tag) => (
              <div key={tag} className="rounded-md border border-black p-2">
                {tag}
              </div>
            ))}
          </div>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createEntryRevision.mutate({
              id: entry.id,
              term: editingTerm,
              definition: editingDefinition,
              links: editingLinks,
              tags: editingTags,
              longDefinition: editingLongDefinition,
            });
          }}
          className="flex flex-col gap-2"
        >
          <input
            type="text"
            placeholder="Title"
            value={editingTerm}
            onChange={(e) => setEditingTerm(e.target.value)}
            className="w-full rounded-md border border-solid border-black p-4 text-black"
          />
          <textarea
            placeholder="Definition"
            value={editingDefinition}
            onChange={(e) => setEditingDefinition(e.target.value)}
            className="w-full rounded-md border border-solid border-black p-4 text-black"
          />
          <textarea
            placeholder="Long Definition"
            value={editingLongDefinition}
            onChange={(e) => setEditingLongDefinition(e.target.value)}
            className="w-full rounded-md border border-solid border-black p-4 text-black"
          />
          <div className="flex flex-col gap-2">
            Links
            <button
              onClick={(e) => {
                e.preventDefault();
                setEditingLinks([...editingLinks, { url: "", title: "" }]);
              }}
            >
              Add Link
            </button>
            {editingLinks.map((link, index) => (
              <div key={index} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...editingLinks];
                    if (newLinks && !!newLinks[index]?.url) {
                      newLinks[index]!.url = e.target.value;
                    }
                    setEditingLinks(newLinks);
                  }}
                />
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => {
                    const newLinks = [...editingLinks];
                    if (newLinks && !!newLinks[index]) {
                      newLinks[index]!.title = e.target.value;
                    }
                    setEditingLinks(newLinks);
                  }}
                />
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Tags"
            value={editingTags.join(", ")}
            onChange={(e) => setEditingTags(e.target.value.split(","))}
            className="w-full rounded-md border border-solid border-black p-4 text-black"
          />
          <button
            type="submit"
            className="rounded-md border border-black bg-white/20 px-10 py-3 font-semibold transition hover:bg-white/20"
            disabled={
              createEntryRevision.isPending ||
              !editingTerm ||
              !editingDefinition ||
              !editingLongDefinition
            }
          >
            {createEntryRevision.isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
      {session?.user?.isVerified && (
        <div className="mt-4 flex gap-2">
          <button
            className="rounded-md border border-black p-2"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
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
