// Imports
// ========================================================
import { NextResponse, type NextRequest } from "next/server";

// Endpoints
// ========================================================
/**
 * Basic GET Request to simuluate LIST in LCRUD
 * @param request
 * @returns
 */
export const GET = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json(
    {
      data: [
        {
          id: "45eb616b-7283-4a16-a4e7-2a25acbfdf02",
          name: "John Doe",
          email: "john.doe@email.com",
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      status: 200,
    }
  );
};
