import { protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";
export const processVerificationRequest = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      isApproval: z.boolean(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      if (!user.isAdmin) {
        throw new Error("Unauthorized");
      }
      const verificationRequest = await ctx.db.verificationRequest.findUnique({
        where: { id: input.id },
      });
      if (!verificationRequest) {
        throw new Error("Verification request not found");
      }
    const { id, isApproval } = input;
    if (isApproval) {
      await ctx.db.user.update({
        where: { id: verificationRequest.userId },
        data: { isVerified: true },
      });
    } else {
      await ctx.db.user.update({
        where: { id: verificationRequest.userId },
        data: { hasFailedVerification: true },
      });
    }
    await ctx.db.verificationRequest.delete({
      where: { id },
    });
    return true;
  });
