import { createTag } from "~/server/api/routers/tag/create";
import { read, search } from "~/server/api/routers/tag/read";
import { createTRPCRouter } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  read: read,
  search: search,
  create: createTag,
});
