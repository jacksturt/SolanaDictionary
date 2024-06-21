import { createEntryRevision } from "~/server/api/routers/entryRevision/create";
import { readRevisionsForEntry } from "~/server/api/routers/entryRevision/read";
import { createTRPCRouter } from "~/server/api/trpc";

export const entryRevisionRouter = createTRPCRouter({
  read: readRevisionsForEntry,
  create: createEntryRevision,
});
