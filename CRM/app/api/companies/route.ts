import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: companies,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching companies:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch companies",
      },
      { status: 500 },
    );
  }
}
