import {
    protectedProcedure
  } from "~/server/api/trpc";

  import { z } from "zod";
export const createVerificationRequest = protectedProcedure.input(z.object({
    details: z.string(),
})).mutation(async ({ ctx, input }) => {
    const { details } = input;
    const { user } = ctx.session;
    const verificationRequest = await ctx.db.verificationRequest.create({ data: { userId: user.id, details } });
    return verificationRequest;
});