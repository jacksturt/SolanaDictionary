import { protectedProcedure } from "~/server/api/trpc";
import { type UnwrapArray, type UnwrapPromise } from "~/utils";

export const read = protectedProcedure.query(({ ctx }) => {
  return ctx.db.verificationRequest.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

export type VerificationRequest = UnwrapArray<UnwrapPromise<ReturnType<typeof read>>>;
