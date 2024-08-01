"use client";
import styles from "~/styles/Leaderboard.module.scss";
import { type Entry } from "~/server/api/routers/entry/read";

import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { api } from "~/trpc/react";
import Modal from "~/app/_components/Modal";
import { EntryModalStaticContent } from "~/content/main/content";

function AnnotatedEntry({
  entry,
  setShowModal,
  setSelectedEntry,
}: {
  entry: Entry;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setSelectedEntry: Dispatch<SetStateAction<Entry | null>>;
}) {
  const [showAnnotations, setShowAnnotations] = useState(false);
  return (
    <div
      className="relative cursor-pointer text-blue-500 underline hover:bg-gray-100"
      onMouseEnter={() => setShowAnnotations(true)}
      onMouseLeave={() => setShowAnnotations(false)}
      onClick={() => {
        setShowModal(true);
        setSelectedEntry(entry);
      }}
    >
      {entry.term}
      {showAnnotations && (
        <div className="absolute left-0 top-6 rounded-md bg-gray-100 p-2">
          {entry.definition}
        </div>
      )}
    </div>
  );
}

function SentenceParserContent() {
  const [sentenceToParse, setSentenceToParse] = useState("");
  const [parse, setParse] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const { data: parsedSentence, isLoading } = api.sentenceParser.parse.useQuery(
    {
      sentence: sentenceToParse,
    },
    {
      enabled: parse,
    },
  );

  useEffect(() => {
    if (parsedSentence) {
      console.log(parsedSentence);
      setParse(false);
    }
  }, [parsedSentence]);

  return (
    <div className={styles.content}>
      <div className={styles.innerContent}>
        <input
          type="text"
          placeholder="Search"
          value={sentenceToParse}
          disabled={isLoading}
          onChange={(e) => setSentenceToParse(e.target.value)}
          className="mb-4 w-full rounded-md border border-solid border-black p-4 text-black"
        />
        <button
          onClick={() => {
            setParse(true);
          }}
          disabled={isLoading}
        >
          Parse
        </button>
      </div>
      {parsedSentence && (
        <div className="flex gap-1">
          {/* @ts-expect-error: This error is irrelevant and wrong */}
          {parsedSentence.map((entry, index) => {
            if (typeof entry === "string") {
              return <div key={index}>{entry}</div>;
            }
            return (
              <AnnotatedEntry
                key={index}
                entry={entry.entry as unknown as Entry}
                setShowModal={setShowModal}
                setSelectedEntry={setSelectedEntry}
              />
            );
          })}
        </div>
      )}
      {showModal && selectedEntry && (
        <Modal setShowModal={setShowModal}>
          <EntryModalStaticContent entry={selectedEntry} />
        </Modal>
      )}
    </div>
  );
}

export { SentenceParserContent };
