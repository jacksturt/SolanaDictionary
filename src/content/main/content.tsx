"use client";
import styles from "~/styles/Leaderboard.module.scss";
import { DataTable } from "~/app/_components/tables/DataTable";
import { EntrySearchResult, type Entry } from "~/server/api/routers/entry/read";
import { type ColumnDef } from "@tanstack/react-table";
import Modal from "~/app/_components/Modal";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { CreateEntry } from "~/app/_components/create-entry";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { cn, getContrastedHexColor } from "~/utils";
import { Prisma } from "@prisma/client";
import { ExternalLink } from "~/types";
import { useRouter } from "next/navigation";
import { Tag } from "~/server/api/routers/tag/read";

const columns: ColumnDef<Entry>[] = [
  {
    accessorKey: "term",
    header: "Term",
    cell: ({ row }) => (
      <div>{`${row.original.term} ${row.original.acronym ? `(${row.original.acronym})` : ""}`}</div>
    ),
  },
  {
    accessorKey: "definition",
    header: "Definition",
    cell: ({ row }) => <div>{row.getValue("definition")}</div>,
  },
  {
    accessorKey: "peerReviewCount",
    header: "Reviews",
    cell: ({ row }) => (
      <div>
        {
          row.original.userEntries.filter((userEntry) => userEntry.hasReviewed)
            .length
        }
      </div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.tags.map((tag) => (
          <div
            key={tag.tag.id}
            className="rounded-md border  p-2"
            style={{ borderColor: tag.tag.color }}
          >
            {tag.tag.name}
          </div>
        ))}
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

export function EntryModalStaticContent({ entry }: { entry: Entry }) {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">{entry.term}</h1>
      <p className="mb-4">{entry.longDefinition}</p>
      {entry.links && (entry.links as ExternalLink[]).length > 0 && (
        <div className="flex flex-col gap-2">
          <div>links:</div>
          {(entry.links as ExternalLink[]).map((link) => (
            <a href={link.url} key={link.url} className="text-blue-500">
              {link.title}
            </a>
          ))}
        </div>
      )}
      <div className="mt-4 flex gap-2">
        {entry.tags.map((tag) => (
          <div
            key={tag.tag.id}
            className="rounded-md border border-black p-2"
            style={{ borderColor: tag.tag.color }}
          >
            {tag.tag.name}
          </div>
        ))}
      </div>
    </>
  );
}

function EntryModalEditContent({
  entry,
  setEditing,
}: {
  entry: Entry;
  setEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const [editingTerm, setEditingTerm] = useState(entry.term);
  const [editingDefinition, setEditingDefinition] = useState(entry.definition);
  const [editingLongDefinition, setEditingLongDefinition] = useState(
    entry.longDefinition ?? "",
  );
  const [editingLinks, setEditingLinks] = useState(
    entry.links as ExternalLink[],
  );
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>(entry.tags.map((tag) => tag.tag));
  const [relations, setRelations] = useState<EntrySearchResult[]>(
    entry.relatedTo.map((relation) => relation.entryB),
  );

  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [entrySearchTerm, setEntrySearchTerm] = useState("");
  const { data: tagSearchResults } = api.tag.search.useQuery(
    { query: tagSearchTerm },
    {
      enabled: !!tagSearchTerm,
    },
  );

  const { data: entrySearchResults } = api.entry.search.useQuery(
    { query: entrySearchTerm },
    {
      enabled: !!entrySearchTerm,
    },
  );

  const createTag = api.tag.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const createEntryRevision = api.entryRevision.create.useMutation({
    onSuccess: () => {
      setEditing(false);
    },
  });
  const createEntryComponent = (entry: Entry) => {
    return (
      <div
        className={cn("flex justify-between", `border-1 border-solid`)}
        key={entry.id}
      >
        {entry.term}{" "}
        <button
          onClick={(e) => {
            e.preventDefault();
            setRelations([...relations, entry]);
            setEntrySearchTerm("");
          }}
        >
          Add
        </button>
      </div>
    );
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createEntryRevision.mutate({
          id: entry.id,
          term: editingTerm,
          definition: editingDefinition,
          links: editingLinks,
          tags: tags.map((tag) => tag.id),
          longDefinition: editingLongDefinition,
          relations: relations.map((relation) => relation.id),
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
              placeholder="URL"
              value={link.url}
              onChange={(e) => {
                const newLinks = [...editingLinks];
                console.log("hello");
                if (newLinks && !!newLinks[index]?.url) {
                  newLinks[index]!.url = e.target.value;
                }
                setEditingLinks(newLinks);
              }}
            />
            <input
              type="text"
              placeholder="Title"
              value={link.title}
              onChange={(e) => {
                const newLinks = [...editingLinks];
                if (newLinks && !!newLinks[index]) {
                  newLinks[index]!.title = e.target.value;
                }
                setEditingLinks(newLinks);
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setEditingLinks(editingLinks.filter((_, i) => i !== index));
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h1>Tags</h1>
        <div className="flex flex-col gap-2">
          {tags.map((tag, index) => (
            <div
              key={tag.id}
              className="rounded-md border  p-2"
              style={{ borderColor: tag.color }}
            >
              {tag.name}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setTags(tags.filter((_, i) => i !== index));
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {tagSearchTerm &&
          !tagSearchResults?.some((tag) => tag.name === tagSearchTerm) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                createTag.mutate(
                  { name: tagSearchTerm, color: getContrastedHexColor() },
                  {
                    onSuccess: (tag) => {
                      setTagSearchTerm("");
                      setTags([...tags, tag as unknown as Tag]);
                    },
                  },
                );
              }}
              disabled={
                !tagSearchTerm ||
                tagSearchResults?.some((tag) => tag.name === tagSearchTerm)
              }
              className="rounded-md border border-black bg-white/20 px-10 py-3 font-semibold transition hover:bg-white/20"
            >
              Create Tag &quot;{tagSearchTerm}&quot;
            </button>
          )}
        <input
          type="text"
          placeholder="Tag Search"
          value={tagSearchTerm}
          onChange={(e) => setTagSearchTerm(e.target.value)}
        />
        {tagSearchResults?.map((tag) => (
          <div
            className={cn("flex justify-between", `border-4 border-solid`)}
            style={{ borderColor: tag.color }}
            key={tag.id}
          >
            {tag.name}{" "}
            <button
              onClick={(e) => {
                e.preventDefault();
                setTags([...tags, tag as unknown as Tag]);
                setTagSearchTerm("");
              }}
            >
              Add
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h1>Related Terms</h1>
        <div className="flex flex-col gap-2">
          {relations.map((relation, index) => (
            <div
              key={relation.id}
              className={cn("flex justify-between", `border-1 border-solid`)}
            >
              {relation.term}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setRelations(relations.filter((_, i) => i !== index));
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search Related Terms"
          value={entrySearchTerm}
          onChange={(e) => setEntrySearchTerm(e.target.value)}
        />
        {/* @ts-expect-error: This error is irrelevant and wrong */}
        {entrySearchResults?.map((entry) => createEntryComponent(entry))}
      </div>
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

  const updateEntry = api.entry.peerReview.useMutation();
  const userHasPeerReviewed = entry.userEntries.some(
    (userEntry) =>
      userEntry.userId === session?.user.id && userEntry.hasReviewed,
  );

  return (
    <Modal setShowModal={setShowModal}>
      {!editing ? (
        <EntryModalStaticContent entry={entry} />
      ) : (
        <EntryModalEditContent entry={entry} setEditing={setEditing} />
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
  console.log("entries", entries!.length);

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
              className="mb-4 rounded-md border border-green-500 p-2"
            >
              + Create New Entry
            </button>
            {!session.user.isVerified &&
              !session.user.hasFailedVerification && (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="mb-4 ml-2 rounded-md border border-black p-2"
                >
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
