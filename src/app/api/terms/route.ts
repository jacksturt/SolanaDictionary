// Imports
// ========================================================
import { NextResponse, type NextRequest } from "next/server";
import { type Entry } from "~/server/api/routers/entry/read";
import { db } from "~/server/db";
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 60 }); // Cache TTL (time-to-live) set to 60 seconds

const getEntries = async (): Promise<Entry[]> => {
  const cacheKey = 'entries';
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData as Entry[];
  }
    const entries = await db.entry.findMany({
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
        orderBy: {
          term: "asc",
        },
      });
    cache.set(cacheKey, entries);
    return entries;
};


 const handler = async () => {

    const entries = await getEntries();
  // Return Response
  return new NextResponse(JSON.stringify(entries), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
};

export { handler as GET, handler as POST, handler as OPTIONS }