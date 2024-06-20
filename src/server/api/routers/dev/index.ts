import { seed } from "~/server/api/routers/dev/seed";
import { createTRPCRouter } from "~/server/api/trpc";

export const devRouter = createTRPCRouter({
  seed: seed,
});
