import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { UpdateEnquirySchema } from "@/lib/validation/enquiry";

// ─── Helpers ────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── GET /api/enquiries/[id] ────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
      include: {
        application: {
          select: {
            id: true,
            clientFullName: true,
            applicationType: true,
            currentStatus: true,
            paymentStatus: true,
          },
        },
      },
    });

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 },
      );
    }

    if (enquiry.companyId !== user.companyId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    console.error("Failed to fetch enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiry" },
      { status: 500 },
    );
  }
}

// ─── PUT /api/enquiries/[id] ────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Check enquiry exists and belongs to company
    const existing = await prisma.enquiry.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 },
      );
    }

    if (existing.companyId !== user.companyId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const parsed = UpdateEnquirySchema.safeParse(body);

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

    const data = parsed.data;

    const enquiry = await prisma.enquiry.update({
      where: { id: params.id },
      data: {
        ...(data.clientName !== undefined && {
          clientName: data.clientName.trim(),
        }),
        ...(data.dateOfBirth !== undefined && {
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth + "T12:00:00")
            : null,
        }),
        ...(data.email !== undefined && {
          email: data.email?.trim() || null,
        }),
        ...(data.phone !== undefined && {
          phone: data.phone?.trim() || null,
        }),
        ...(data.enquiryType !== undefined && {
          enquiryType: data.enquiryType.trim(),
        }),
        ...(data.notes !== undefined && {
          notes: data.notes?.trim() || null,
        }),
        ...(data.followUpDate !== undefined && {
          followUpDate: data.followUpDate
            ? new Date(data.followUpDate + "T12:00:00")
            : null,
        }),
      },
      include: {
        application: { select: { id: true } },
      },
    });

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    console.error("Failed to update enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update enquiry" },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/enquiries/[id] ─────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const existing = await prisma.enquiry.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 },
      );
    }

    if (existing.companyId !== user.companyId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    await prisma.enquiry.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete enquiry" },
      { status: 500 },
    );
  }
}
