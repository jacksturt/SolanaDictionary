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
    relations: z.array(z.string()),
    longDefinition: z.string(),
})).mutation(async ({ ctx, input }) => {
    const { term, definition, links, tags, longDefinition, relations } = input;
    const { user } = ctx.session;
    const entry = await ctx.db.entry.findUnique({ where: { id: input.id }, include: { tags: true, relatedTo: { include: { entryB: true } } } });
    if (!entry) {
        throw new Error("Entry not found");
    }
    const userEntry = await ctx.db.userEntry.findUnique({ where: { userId_entryId: { userId: user.id, entryId: entry.id } } });

    const entryRevision = await ctx.db.entryRevision.create({ data: {
        previousDefinition: entry.definition,
        previousTerm: entry.term,
        previousLinks: entry.links ?? [],
        previousTags: entry.tags.map((tag) => tag.tagId),
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

    const currentTagNames = entry.tags.map(tag => tag.tagId) || [];

  // Determine tags to disconnect
  const tagsToDisconnect = currentTagNames.filter(tag => !tags.includes(tag));


  const tagsToCreateAndConnect = tags.filter(tag => !currentTagNames.includes(tag));
    const currentRelatedTerms = entry.relatedTo.map(relation => relation.entryB.id) || [];
    const relatedTermsToDisconnect = currentRelatedTerms.filter(term => !relations.includes(term));
    const relatedTermsToCreateAndConnect = relations.filter(term => !currentRelatedTerms.includes(term));


    const tagsExist = await ctx.db.tag.findMany({
        where: {
          id: { in: tagsToCreateAndConnect } // Replace `tagIds` with the array of IDs you are trying to connect
        }
      });

    await ctx.db.entry.update({ where: { id: entry.id }, data: { currentVersionId: entryRevision.id,
        term: term,
        definition: definition,
        longDefinition: longDefinition,
        links: links,
        },

     } );
     await ctx.db.entryTag.deleteMany({ where: { entryId: entry.id, tagId: { in: tagsToDisconnect } } });
     await ctx.db.entryTag.createMany({ data: tagsExist.map((tag) => ({ entryId: entry.id, tagId: tag.id })) });
    //  Right now we are creating duplicate rows, but this allows for a relatedTo that is not in my relatedFrom, which may be used in the future
     await ctx.db.entryRelation.deleteMany({ where: { entryAId: entry.id, entryBId: { in: relatedTermsToDisconnect } } });
     await ctx.db.entryRelation.createMany({ data: relatedTermsToCreateAndConnect.map((term) => ({ entryAId: entry.id, entryBId: term })) });
     await ctx.db.entryRelation.deleteMany({ where: { entryBId: entry.id, entryAId: { in: relatedTermsToDisconnect } } });
     await ctx.db.entryRelation.createMany({ data: relatedTermsToCreateAndConnect.map((term) => ({ entryBId: entry.id, entryAId: term })) });
    return entryRevision;
});