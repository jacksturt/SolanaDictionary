import {
    protectedProcedure
  } from "~/server/api/trpc";

  import { z } from "zod";
export const createTag = protectedProcedure.input(z.object({
    name: z.string(),
    color: z.string(),
})).mutation(async ({ ctx, input }) => {
    const { name, color } = input;
    const tag = await ctx.db.tag.create({ data: { name, color } });
    return tag;
});