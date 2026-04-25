export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

/**
 * GET /api/auth/me
 * Returns the current authenticated user's data from their JWT token
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authToken cookie
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No authentication token found" },
        { status: 401 },
      );
    }

    // Verify and decode the token
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Return the user data
    return NextResponse.json({
      userId: payload.userId,
      email: payload.email,
      companyId: payload.companyId,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 },
    );
  }
}
