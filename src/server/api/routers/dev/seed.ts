import { type Prisma } from "@prisma/client";

const entries: Prisma.EntryCreateInput[] = [];

import { protectedProcedure } from "~/server/api/trpc";

export const seed = protectedProcedure.mutation(async ({ ctx }) => {
  if (!ctx.session.user.isAdmin) {
    throw new Error("You are not authorized to seed the database");
  }
  const { user } = ctx.session;
  await Promise.all(
    entries.map(
      async ({ term, definition, links, tags, longDefinition, acronym }) => {
        const entry = await ctx.db.entry.create({
          data: { term, definition, links, tags, longDefinition, acronym },
        });
        await ctx.db.userEntry.create({
          data: { userId: user.id, entryId: entry.id, isCreator: true },
        });
        return entry;
      },
    ),
  );
  return true;
});
