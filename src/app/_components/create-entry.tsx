import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";
import { ExternalLink } from "~/types";

export function CreateEntry() {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [longDefinition, setLongDefinition] = useState("");

  const createPost = api.entry.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setTerm("");
      setDefinition("");
      setLinks([]);
      setTags([]);
      setLongDefinition("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ term, definition, links, tags, longDefinition });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Term"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full rounded-md border border-solid border-black p-4 text-black"
      />
      <textarea
        placeholder="Definition"
        value={definition}
        onChange={(e) => setDefinition(e.target.value)}
        className="w-full rounded-md border border-solid border-black p-4 text-black"
      />
      <textarea
        placeholder="Long Definition"
        value={longDefinition}
        onChange={(e) => setLongDefinition(e.target.value)}
        className="w-full rounded-md border border-solid border-black p-4 text-black"
      />
      <div>
        Links
        <button onClick={() => setLinks([...links, { url: "", title: "" }])}>
          Add Link
        </button>
        {links.map((link, index) => (
          <div key={index}>
            <input type="text" value={link.url} />
            <input type="text" value={link.title} />
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value.split(","))}
        className="w-full rounded-md border border-solid border-black p-4 text-black"
      />
      <button
        type="submit"
        className="rounded-md border border-black bg-white/20 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={
          createPost.isPending || !term || !definition || !longDefinition
        }
      >
        {createPost.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
