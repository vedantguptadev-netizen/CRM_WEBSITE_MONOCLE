import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Compare password (basic comparison - consider hashing in production)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Create JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      companyId: user.companyId,
    });

    // Create response with token
    const response = NextResponse.json(
      {
        success: true,
        companyId: user.companyId,
        userId: user.id,
      },
      { status: 200 },
    );

    // Set token as HTTP-only secure cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
