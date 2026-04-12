import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Clears the authToken cookie to log out the user
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 },
    );

    // Clear the authToken cookie
    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Delete the cookie
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 },
    );
  }
}
