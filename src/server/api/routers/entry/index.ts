import { createEntry } from "~/server/api/routers/entry/create";
import { read } from "~/server/api/routers/entry/read";
import { peerReview } from "~/server/api/routers/entry/update";
import { createTRPCRouter } from "~/server/api/trpc";

export const entryRouter = createTRPCRouter({
  read: read,
  create: createEntry,
  peerReview: peerReview,
});
