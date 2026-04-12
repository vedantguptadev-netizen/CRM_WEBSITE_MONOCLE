import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// ─── Zod Schemas ────────────────────────────────────────────────

const CreateEnquirySchema = z.object({
  clientName: z.string().min(1, "Client name is required").max(200),
  email: z
    .string()
    .email("Invalid email")
    .max(200)
    .optional()
    .or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  enquiryType: z.string().min(1, "Enquiry type is required").max(100),
  notes: z.string().max(2000).optional().or(z.literal("")),
  followUpDate: z.string().optional().or(z.literal("")),
});

// ─── Helpers ────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── GET /api/enquiries ─────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const enquiries = await prisma.enquiry.findMany({
      where: { companyId: user.companyId },
      include: {
        application: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error("Failed to fetch enquiries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiries" },
      { status: 500 },
    );
  }
}

// ─── POST /api/enquiries ────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = CreateEnquirySchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          message: firstError?.message || "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { clientName, email, phone, enquiryType, notes, followUpDate } =
      parsed.data;

    const enquiry = await prisma.enquiry.create({
      data: {
        clientName: clientName.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        enquiryType: enquiryType.trim(),
        notes: notes?.trim() || null,
        followUpDate: followUpDate
          ? new Date(followUpDate + "T12:00:00")
          : null,
        companyId: user.companyId,
      },
      include: {
        application: { select: { id: true } },
      },
    });

    return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
  } catch (error) {
    console.error("Failed to create enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create enquiry" },
      { status: 500 },
    );
  }
}
