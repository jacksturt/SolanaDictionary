

import { createEntry } from "~/server/api/routers/entry/create";
import { read } from "~/server/api/routers/entry/read";
import {
  createTRPCRouter,
} from "~/server/api/trpc";

export const entryRouter = createTRPCRouter({
  read: read,
  create: createEntry,
});
