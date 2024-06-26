import cors from "~/utils/cors";
import { db } from "~/server/db";

export async function GET(request: Request) {

    console.log("Hello, Next.js!");
    return cors(request, new Response('Hello, Next.js!', {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      }
    }));
  }