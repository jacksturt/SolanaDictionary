import { publicProcedure } from "~/server/api/trpc";
import { type UnwrapArray, type UnwrapPromise } from "~/utils";
import { z } from "zod";

export const readRevisionsForEntry = publicProcedure.input(z.object({
  id: z.string(),
})).query(({ ctx, input }) => {
  return ctx.db.entryRevision.findMany({
    where: {
      entryId: input.id,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

export type EntryRevision = UnwrapArray<UnwrapPromise<ReturnType<typeof readRevisionsForEntry>>>;
