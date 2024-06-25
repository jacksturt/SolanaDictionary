import {
    publicProcedure
  } from "~/server/api/trpc";
  import { z } from "zod";
import { Entry, search } from "~/server/api/routers/entry/read";

export type ParsedSentenceEntry = string | { term: string, entry: Entry };

  export const parseSentence = publicProcedure.input(z.object({
    sentence: z.string(),
  })).query(async ({ ctx, input }) => {
    const { sentence } = input;
    const splitSentence = sentence.split(" ");
    const parsedSentence: ParsedSentenceEntry[] = [];
    let currentWord = splitSentence[0];
    let currentIndex = 0;
    while (currentWord) {
        const exactMatch = await ctx.db.entry.findFirst({
            include: {
                userEntries: {
                  include: {
                    user: true,
                  },
                },
                tags: {
                  include: {
                    tag: true,
                  },
                },
                relatedTo: {
                  include: {
                    entryB: true,
                  },
                },
              },
            where: {
                term: currentWord,
            },
        });
        if (exactMatch) {
            parsedSentence.push({ term: exactMatch.term, entry: exactMatch });
            currentWord = splitSentence[currentIndex + 1];
            currentIndex++;
            continue;
        }


        const searchResults = await ctx.db.entry.findMany({
            where: {
                term: { contains: currentWord },
            },
        });
        if (searchResults.length === 0) {
            if (typeof parsedSentence[parsedSentence.length - 1] === "string") {
                const lastString: string = parsedSentence[parsedSentence.length - 1] as string;
                const newString = lastString + " " + currentWord;
                parsedSentence[parsedSentence.length - 1] = newString;
            } else {
                parsedSentence.push(currentWord);
            }
            currentWord = splitSentence[currentIndex + 1];
            currentIndex++;
            continue;
        } else {
            currentWord += " " + splitSentence[currentIndex + 1];
            currentIndex++;
            continue;
        }
    }
    return parsedSentence;
  });