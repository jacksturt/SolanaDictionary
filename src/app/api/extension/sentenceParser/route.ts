// Imports
// ========================================================
import { NextResponse, type NextRequest } from "next/server";
import cors from "~/utils/cors";



// Endpoints
// ========================================================
/**
 * Basic GET Request to simuluate LIST in LCRUD
 * @param request
 * @returns
 */
 const handler = async (request: NextRequest) => {
  // Return Response
  return cors(
    request,
    new Response(JSON.stringify({ message: 'Hello World!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  )
};

export { handler as GET, handler as OPTIONS }