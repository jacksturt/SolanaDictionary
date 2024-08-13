import {
    protectedProcedure
  } from "~/server/api/trpc";

  import { z } from "zod";
export const createEntry = protectedProcedure.input(z.object({
    term: z.string(),
    definition: z.string(),
    links: z.array(z.object({
        url: z.string(),
        title: z.string(),
    })),
    tags: z.optional(z.array(z.string())),
    relatedTo: z.optional(z.array(z.string())),
    relatedFrom: z.optional(z.array(z.string())),
    longDefinition: z.string(),
    acronym: z.optional(z.string()),
})).mutation(async ({ ctx, input }) => {
    const { term, definition, links, tags, longDefinition, relatedTo, relatedFrom, acronym } = input;
    const { user } = ctx.session;
    const entry = await ctx.db.entry.create(
        { data:
            { term,
            definition,
            links,
            tags: { create: tags?.map((id) => ({ tag: { connect: { id } } })) },
            longDefinition,
            relatedTo: { create: relatedTo?.map((id) => ({ entryB: { connect: { id } } })) },
            relatedFrom: { create: relatedFrom?.map((id) => ({ entryA: { connect: { id } } })) },
            } });
    await ctx.db.userEntry.create({ data: { userId: user.id, entryId: entry.id, isCreator: true } });
    return entry;
});

export const createNewEntryRequest = protectedProcedure.input(z.object({
    term: z.string(),
})).mutation(async ({ ctx, input }) => {
    const { term } = input;
    const { user } = ctx.session;
    const entry = await ctx.db.entry.create(
        { data:
            { term,
            definition: "TODO",
            hidden: true,
            updateRequested: true,
            } });
    await ctx.db.userEntry.create({ data: { userId: user.id, entryId: entry.id, isCreator: true } });
    return entry;
});