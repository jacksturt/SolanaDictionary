import { protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";
export const peerReview = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      hasBeenPeerReviewed: z.boolean(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { id, hasBeenPeerReviewed } = input;
    const { user } = ctx.session;
    const entry = await ctx.db.entry.findUnique({ where: { id } });
    if (!entry) {
      throw new Error("Entry not found");
    }
    let peerReview = await ctx.db.entryReview.findUnique({ where: { userId_entryId: { userId: user.id, entryId: id } } });
    let userEntry = await ctx.db.userEntry.findUnique({ where: { userId_entryId: { userId: user.id, entryId: id } } });
    if(!userEntry && hasBeenPeerReviewed) {
      userEntry = await ctx.db.userEntry.create({ data: { userId: user.id, entryId: id } });
    } else if(userEntry && hasBeenPeerReviewed) {
      userEntry = await ctx.db.userEntry.update({ where: { userId_entryId: { userId: user.id, entryId: id } }, data: { hasReviewed: true } });
    } else if (userEntry && !hasBeenPeerReviewed && !userEntry.hasEdited && !userEntry.hasLiked && !userEntry.isCreator) {
      userEntry = await ctx.db.userEntry.delete({ where: { userId_entryId: { userId: user.id, entryId: id } } });
    }
    if (!peerReview) {
      peerReview = await ctx.db.entryReview.create({ data: { userId: user.id, entryId: id } });
    } else {
      if(hasBeenPeerReviewed) {
        peerReview = await ctx.db.entryReview.update({ where: { userId_entryId: { userId: user.id, entryId: id } }, data: { reviewedVersionId: entry.currentVersionId } });
      } else {
        peerReview = await ctx.db.entryReview.delete({ where: { userId_entryId: { userId: user.id, entryId: id } } });
      }
    }
    return peerReview;
  });
