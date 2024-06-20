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
    let userEntry = await ctx.db.userEntry.findUnique({
      where: { userId_entryId: { userId: user.id, entryId: id } },
    });
    if (!userEntry) {
      userEntry = await ctx.db.userEntry.create({
        data: {
          userId: user.id,
          entryId: id,
          hasReviewed: hasBeenPeerReviewed,
        },
      });
    } else {
      userEntry = await ctx.db.userEntry.update({
        where: { userId_entryId: { userId: user.id, entryId: id } },
        data: { hasReviewed: hasBeenPeerReviewed },
      });
    }
    await ctx.db.entry.update({
      where: { id },
      data: { peerReviewCount: { increment: hasBeenPeerReviewed ? 1 : -1 } },
    });
    return userEntry;
  });
