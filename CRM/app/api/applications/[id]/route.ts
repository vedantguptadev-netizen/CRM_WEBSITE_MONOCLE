import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { UpdateApplicationSchema } from "@/lib/validation/application";

// ─── Helpers ────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── GET /api/applications/[id] ─────────────────────────────────

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

    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        enquiry: {
          select: {
            id: true,
            clientName: true,
            email: true,
            phone: true,
            enquiryType: true,
            customEnquiryType: true,
            notes: true,
            followUpDate: true,
            dateOfBirth: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 },
      );
    }

    if (application.companyId !== user.companyId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error("Failed to fetch application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch application" },
      { status: 500 },
    );
  }
}

// ─── PUT /api/applications/[id] ─────────────────────────────────

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

    const existing = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
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
    const parsed = UpdateApplicationSchema.safeParse(body);

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

    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        ...(data.clientFullName !== undefined && {
          clientFullName: data.clientFullName.trim(),
        }),
        ...(data.applicationType !== undefined && {
          applicationType: data.applicationType?.trim() || null,
        }),
        ...(data.email !== undefined && {
          email: data.email?.trim() || null,
        }),
        ...(data.phone !== undefined && {
          phone: data.phone?.trim() || null,
        }),
        ...(data.notes !== undefined && {
          notes: data.notes?.trim() || null,
        }),
        ...(data.paymentStatus !== undefined && {
          paymentStatus: data.paymentStatus,
        }),
        ...(data.currentStatus !== undefined && {
          currentStatus: data.currentStatus,
        }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate + "T12:00:00") : null,
        }),
        ...(data.assignedEmployeeId !== undefined && {
          assignedEmployeeId: data.assignedEmployeeId?.trim() || null,
        }),
        ...(data.driveFolderLink !== undefined && {
          driveFolderLink: data.driveFolderLink?.trim() || null,
        }),
      },
      include: {
        enquiry: {
          select: { id: true, clientName: true, enquiryType: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error("Failed to update application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update application" },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/applications/[id] ──────────────────────────────

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

    const existing = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 },
      );
    }

    if (existing.companyId !== user.companyId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    await prisma.application.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete application" },
      { status: 500 },
    );
  }
}
