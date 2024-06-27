// Imports
// ========================================================
import { NextResponse, type NextRequest } from "next/server";
import { ParsedSentenceEntry } from "~/server/api/routers/sentenceParser/parse";
import { db } from "~/server/db";

 const handler = async (request: NextRequest) => {
  const data = await request.json();
  console.log(data);
  const { sentence } = data;
  const splitSentence = sentence.split(" ");
    const parsedSentence: ParsedSentenceEntry[] = [];
    let currentWord = splitSentence[0];
    let currentIndex = 0;
    while (currentWord) {
        console.log(currentWord, currentIndex, splitSentence.length);
        const exactMatch = await db.entry.findFirst({
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
                term: {
                    startsWith: currentWord,
                    endsWith: currentWord,
                    mode: "insensitive",
                },
            },
        });
        if (exactMatch) {
            console.log('match')
            parsedSentence.push({ term: exactMatch.term, entry: exactMatch });
            currentWord = splitSentence[currentIndex + 1];
            currentIndex++;
            continue;
        }


        const searchResults = await db.entry.findMany({
            where: {
                term: { startsWith: currentWord, mode: "insensitive" },
            },
        });
        if (searchResults.length === 0) {
            if (typeof parsedSentence[parsedSentence.length - 1] === "string") {
                console.log('string')
                const lastString: string = parsedSentence[parsedSentence.length - 1] as string;
                const newString = lastString + " " + currentWord;
                parsedSentence[parsedSentence.length - 1] = newString;
            } else {
                console.log('not string')
                parsedSentence.push(currentWord);
            }
            currentWord = splitSentence[currentIndex + 1];
            currentIndex++;
            continue;
        } else {
            console.log('extend word')
            currentWord += " " + splitSentence[currentIndex + 1];
            currentIndex++;
            continue;
        }
    }
  // Return Response
  return new NextResponse(JSON.stringify({ parsedSentence }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
};

export { handler as GET, handler as POST, handler as OPTIONS }