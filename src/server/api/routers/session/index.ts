import { type Session } from "next-auth";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getServerAuthSession } from "~/server/auth";

export const sessionRouter = createTRPCRouter({
  read: protectedProcedure.query(async (): Promise<Session | null> => {
    const session = await getServerAuthSession();
    return session;
  }),
});
