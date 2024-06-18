import {
    protectedProcedure
  } from "~/server/api/trpc";

  import { z } from "zod";
export const createEntry = protectedProcedure.input(z.object({
    term: z.string(),
    definition: z.string(),
    links: z.array(z.string()),
    tags: z.array(z.string()),
    longDefinition: z.string(),
})).mutation(async ({ ctx, input }) => {
    const { term, definition, links, tags, longDefinition } = input;
    const { user } = ctx.session;
    const entry = await ctx.db.entry.create({ data: { term, definition, links, tags, longDefinition } });
    await ctx.db.userEntry.create({ data: { userId: user.id, entryId: entry.id, isCreator: true } });
    return entry;
});