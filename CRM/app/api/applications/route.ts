import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { CreateApplicationSchema } from "@/lib/validation/application";

// ─── Auth helper ────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── POST /api/applications ─────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const payload = await getAuthenticatedUser();
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const companyId = payload.companyId;

    // Parse and validate request body
    const body = await request.json();
    const parsed = CreateApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Validation error",
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // If enquiryId is provided, verify it belongs to this company
    if (data.enquiryId) {
      const enquiry = await prisma.enquiry.findUnique({
        where: { id: data.enquiryId },
        select: { companyId: true },
      });

      if (!enquiry || enquiry.companyId !== companyId) {
        return NextResponse.json(
          { success: false, message: "Enquiry not found" },
          { status: 404 },
        );
      }

      // Check if this enquiry already has an application
      const existing = await prisma.application.findUnique({
        where: { enquiryId: data.enquiryId },
      });

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: "This enquiry already has an application",
          },
          { status: 400 },
        );
      }
    }

    // Create application with company scoping
    const application = await prisma.application.create({
      data: {
        clientFullName: data.clientFullName.trim(),
        applicationType: data.applicationType?.trim() || null,
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        notes: data.notes?.trim() || null,
        paymentStatus: data.paymentStatus,
        currentStatus: data.currentStatus,
        dueDate: data.dueDate ? new Date(data.dueDate + "T12:00:00") : null,
        assignedEmployeeId: data.assignedEmployeeId?.trim() || null,
        driveFolderLink: data.driveFolderLink?.trim() || null,
        companyId,
        enquiryId: data.enquiryId || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application created successfully",
        data: application,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create application" },
      { status: 500 },
    );
  }
}

// ─── GET /api/applications ──────────────────────────────────────

export async function GET() {
  try {
    const payload = await getAuthenticatedUser();
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const applications = await prisma.application.findMany({
      where: { companyId: payload.companyId },
      include: {
        enquiry: {
          select: {
            id: true,
            clientName: true,
            enquiryType: true,
            dateOfBirth: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, data: applications },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
