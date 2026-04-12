import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { CreateApplicationFromEnquirySchema } from "@/lib/validation/application";

// ─── Auth helper ────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── POST /api/applications/from-enquiry ────────────────────────

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
    const parsed = CreateApplicationFromEnquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Validation error",
        },
        { status: 400 },
      );
    }

    const { enquiryId } = parsed.data;

    // Get the enquiry and verify it belongs to this company
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: enquiryId },
      select: {
        id: true,
        clientName: true,
        email: true,
        phone: true,
        enquiryType: true,
        notes: true,
        companyId: true,
        application: {
          select: { id: true },
        },
      },
    });

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 },
      );
    }

    if (enquiry.companyId !== companyId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    // Check if enquiry already has an application
    if (enquiry.application) {
      return NextResponse.json(
        {
          success: false,
          message: "This enquiry already has an application",
        },
        { status: 400 },
      );
    }

    // Create application with prefilled data from enquiry
    const application = await prisma.application.create({
      data: {
        clientFullName: enquiry.clientName,
        applicationType: enquiry.enquiryType || null,
        email: enquiry.email || null,
        phone: enquiry.phone || null,
        notes: enquiry.notes || null,
        paymentStatus: "PENDING",
        currentStatus: "IN_PROCESS",
        dueDate: null,
        assignedEmployeeId: null,
        companyId,
        enquiryId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application created from enquiry successfully",
        data: application,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create application from enquiry:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create application from enquiry",
      },
      { status: 500 },
    );
  }
}
