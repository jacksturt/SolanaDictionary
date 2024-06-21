import {
    protectedProcedure
  } from "~/server/api/trpc";

  import { z } from "zod";

export const createEntryRevision = protectedProcedure.input(z.object({
    id: z.string(),
    term: z.string(),
    definition: z.string(),
    links: z.array(z.object({
        url: z.string(),
        title: z.string(),
    })),
    tags: z.array(z.string()),
    longDefinition: z.string(),
})).mutation(async ({ ctx, input }) => {
    const { term, definition, links, tags, longDefinition } = input;
    const { user } = ctx.session;
    const entry = await ctx.db.entry.findUnique({ where: { id: input.id } });
    if (!entry) {
        throw new Error("Entry not found");
    }
    const userEntry = await ctx.db.userEntry.findUnique({ where: { userId_entryId: { userId: user.id, entryId: entry.id } } });

    const entryRevision = await ctx.db.entryRevision.create({ data: {
        previousDefinition: entry.definition,
        previousTerm: entry.term,
        previousLinks: entry.links ?? [],
        previousTags: entry.tags,
        previousLongDefinition: entry.longDefinition,
        term,
        definition,
        links,
        tags,
        longDefinition,
        userId: user.id,
        entryId: entry.id,
        parentId: entry.currentVersionId
    } });
    if(userEntry) {
        await ctx.db.userEntry.update({ where: { userId_entryId: { userId: user.id, entryId: entry.id } }, data: { hasEdited: true } });
    } else {

        await ctx.db.userEntry.create({ data: { userId: user.id, entryId: entry.id, hasEdited: true } });
    }
    await ctx.db.entry.update({ where: { id: entry.id }, data: { currentVersionId: entryRevision.id } });
    return entryRevision;
});