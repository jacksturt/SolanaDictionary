import { createVerificationRequest } from "~/server/api/routers/verificationRequests/create";
import { read } from "~/server/api/routers/verificationRequests/read";
import { processVerificationRequest } from "~/server/api/routers/verificationRequests/update";
import { createTRPCRouter } from "~/server/api/trpc";

export const verificationRequestRouter = createTRPCRouter({
  read: read,
  create: createVerificationRequest,
  processVerificationRequest: processVerificationRequest,
});
