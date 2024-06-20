import { publicProcedure } from "~/server/api/trpc";
import { type UnwrapArray, type UnwrapPromise } from "~/utils";

export const read = publicProcedure.query(({ ctx }) => {
  return ctx.db.entry.findMany({
    include: {
      userEntries: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      term: "asc",
    },
  });
});

export type Entry = UnwrapArray<UnwrapPromise<ReturnType<typeof read>>>;
