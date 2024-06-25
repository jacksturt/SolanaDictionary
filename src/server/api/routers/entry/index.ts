import { createEntry } from "~/server/api/routers/entry/create";
import { read, search } from "~/server/api/routers/entry/read";
import { peerReview } from "~/server/api/routers/entry/update";
import { createTRPCRouter } from "~/server/api/trpc";

export const entryRouter = createTRPCRouter({
  read: read,
  search: search,
  create: createEntry,
  peerReview: peerReview,
});
