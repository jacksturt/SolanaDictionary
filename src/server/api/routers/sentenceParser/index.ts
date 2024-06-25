import { parseSentence } from "~/server/api/routers/sentenceParser/parse";
import { createTRPCRouter } from "~/server/api/trpc";

export const sentenceParserRouter = createTRPCRouter({
  parse: parseSentence,
});
