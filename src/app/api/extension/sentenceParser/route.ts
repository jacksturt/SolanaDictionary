// Imports
// ========================================================
import { NextResponse, type NextRequest } from "next/server";
import { Entry } from "~/server/api/routers/entry/read";
import { db } from "~/server/db";
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 60 }); // Cache TTL (time-to-live) set to 60 seconds

const getTermAndAcronymMap = async (): Promise<Record<string, Partial<Entry>>> => {
  const cacheKey = 'termAndAcronymMap';
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData as Record<string, Partial<Entry>>;
  }
    const entries = await db.entry.findMany({select: {term: true, acronym: true, definition: true}});
    const termAndAcronymMap: Record<string, Partial<Entry>> = {};
    entries.forEach(entry => {
        termAndAcronymMap[entry.term.toLowerCase()] = entry;
        if( entry.acronym) {
            termAndAcronymMap[entry.acronym.toLowerCase()] = entry;
        }
    });
    cache.set(cacheKey, termAndAcronymMap);
    return termAndAcronymMap;
};

type ParsedSentenceMinified = {rawContent: string, word: string} | { term: string, entry: Partial<Entry>,
  type: "term" | "acronym", rawContent: string};

type ParsedSentenceWithElementId = {
    sentence: ParsedSentenceMinified[];
    elementId: string;
}

const parseSentence = async (sentence: string, elementId: string): Promise<ParsedSentenceWithElementId> => {
  const termAndAcronymMap = await getTermAndAcronymMap();

  const splitSentence = sentence.split(" ");
    const parsedSentence: ParsedSentenceMinified[] = [];
    let currentWord = splitSentence[0];
    let currentIndex = 0;
    while (currentWord) {
      console.log(currentWord);
        const hasStartingMark = currentWord.startsWith("<mark>");
        const hasEndingMark = currentWord.endsWith("</mark>");
        const lowerCaseCurrentWord = currentWord.toLowerCase();
        const strippedLowerCase = lowerCaseCurrentWord.replace("<mark>", '').replace("</mark>", '');
        const exactMatch = termAndAcronymMap[strippedLowerCase];
        if (exactMatch) {
            parsedSentence.push({
                rawContent: (hasStartingMark && !hasEndingMark ? "<mark>" : "") + currentWord,
                term: exactMatch.term ?? "",
                entry: exactMatch,
                type: exactMatch.term?.toLowerCase() === lowerCaseCurrentWord ? "term" : "acronym"

            });
            currentWord = splitSentence[currentIndex + 1];
            currentIndex++;
            continue;
        }


        const searchResults = Object.keys(termAndAcronymMap).filter(key => key.startsWith(lowerCaseCurrentWord));
        if (searchResults.length === 0) {
          const lastElement = parsedSentence[parsedSentence.length - 1];
            if (lastElement && 'word' in lastElement)  {
              let lastString: string = lastElement.word;

              if(hasEndingMark && !hasStartingMark && !lastString.includes("<mark>")) {
                lastString = "<mark>" + lastString;
              }
                const newString = lastString + " " + currentWord;
                parsedSentence[parsedSentence.length - 1] = {rawContent: (hasStartingMark && !hasEndingMark && !lastElement.rawContent.includes("<mark>") ? "<mark>" : "") + lastElement.rawContent + " " + currentWord, word: newString};
            } else {
                parsedSentence.push({rawContent: currentWord, word: currentWord});
            }
            currentWord = splitSentence[currentIndex + 1];
            currentIndex++;
            continue;
        } else {
            currentWord += (hasStartingMark && !hasEndingMark ? "<mark>" : "") + " " + splitSentence[currentIndex + 1];
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