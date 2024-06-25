import { publicProcedure } from "~/server/api/trpc";
import { type UnwrapArray, type UnwrapPromise } from "~/utils";
import { z } from "zod";

export const read = publicProcedure.query(({ ctx }) => {
  return ctx.db.entry.findMany({
    include: {
      userEntries: {
        include: {
          user: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      relatedTo: {
        include: {
          entryB: true,
        },
      },
    },
    orderBy: {
      term: "asc",
    },
  });
});

export const search = publicProcedure.input(z.object({
    query: z.string(),
})).query(({ ctx, input }) => {
    const { query } = input;
    return ctx.db.entry.findMany({
        where: {
            term: { contains: query },
        },
    });
});

export type Entry = UnwrapArray<UnwrapPromise<ReturnType<typeof read>>>;
export type EntrySearchResult = UnwrapArray<UnwrapPromise<ReturnType<typeof search>>>;
