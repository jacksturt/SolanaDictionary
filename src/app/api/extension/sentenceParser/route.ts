// Imports
// ========================================================
import { NextResponse, type NextRequest } from "next/server";
import { Entry } from "~/server/api/routers/entry/read";
import { ParsedSentenceEntry } from "~/server/api/routers/sentenceParser/parse";
import { db } from "~/server/db";
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 60 }); // Cache TTL (time-to-live) set to 60 seconds

const getTermAndAcronymMap = async (): Promise<{ [key: string]: Partial<Entry> }> => {
  const cacheKey = 'termAndAcronymMap';
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData as { [key: string]: Partial<Entry> };
  }
    const entries = await db.entry.findMany({select: {term: true, acronym: true, definition: true}});
    const termAndAcronymMap: { [key: string]: Partial<Entry> } = {};
    entries.forEach(entry => {
        termAndAcronymMap[entry.term.toLowerCase()] = entry;
        if( entry.acronym) {
            termAndAcronymMap[entry.acronym.toLowerCase()] = entry;
        }
    });
    cache.set(cacheKey, termAndAcronymMap);
    return termAndAcronymMap;
};

type ParsedSentenceWithElementId = {
    sentence: ParsedSentenceEntry[];
    elementId: string;
}

const parseSentence = async (sentence: string, elementId: string): Promise<ParsedSentenceWithElementId> => {
  const termAndAcronymMap = await getTermAndAcronymMap();

  const splitSentence = sentence.toLowerCase().split(" ");
    const parsedSentence: ParsedSentenceEntry[] = [];
    let currentWord = splitSentence[0];
    let currentIndex = 0;
    while (currentWord) {
        const exactMatch = termAndAcronymMap[currentWord];
        if (exactMatch) {
            parsedSentence.push({ term: exactMatch.term ?? "", entry: exactMatch });
            currentWord = splitSentence[currentIndex + 1];
            currentIndex++;
            continue;
        }


        const searchResults = Object.keys(termAndAcronymMap).filter(key => key.startsWith(currentWord!));
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
    return { sentence: parsedSentence, elementId };
}

 const handler = async (request: NextRequest) => {
  const data = await request.json() as { sentences: {sentence: string, elementId: string}[] };
  const { sentences } = data;
  const parsedSentences = await Promise.all(sentences.map(sentence => parseSentence(sentence.sentence, sentence.elementId)));

  // Return Response
  return new NextResponse(JSON.stringify({ parsedSentences }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
};

export { handler as GET, handler as POST, handler as OPTIONS }