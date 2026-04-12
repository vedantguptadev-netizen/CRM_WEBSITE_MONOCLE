/**
 * @jest-environment node
 */

import { POST } from "@/app/api/applications/from-enquiry/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── Mocks ──────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: {
    application: {
      create: jest.fn(),
    },
    enquiry: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/lib/jwt", () => ({
  verifyToken: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

const mockPrisma = jest.mocked(prisma);

import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

const mockVerifyToken = jest.mocked(verifyToken);
const mockCookies = jest.mocked(cookies);

// Helper to set up authenticated user
function authenticateAs(companyId = "company-1", userId = "user-1") {
  mockCookies.mockReturnValue({
    get: (name: string) =>
      name === "authToken"
        ? { name: "authToken", value: "valid-jwt" }
        : undefined,
  } as any);
  mockVerifyToken.mockResolvedValue({
    userId,
    companyId,
    email: "test@example.com",
  } as any);
}

function clearAuth() {
  mockCookies.mockReturnValue({
    get: () => undefined,
  } as any);
}

// ─── Tests ──────────────────────────────────────────────────────

describe("POST /api/applications/from-enquiry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no token provided", async () => {
    clearAuth();
    const request = new NextRequest(
      "http://localhost:3000/api/applications/from-enquiry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Unauthorized");
  });

  it("should return 400 for validation errors", async () => {
    authenticateAs();

    const request = new NextRequest(
      "http://localhost:3000/api/applications/from-enquiry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Missing enquiryId
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.success).toBe(false);
  });

  it("should return 404 if enquiry not found", async () => {
    authenticateAs();

    mockPrisma.enquiry.findUnique.mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost:3000/api/applications/from-enquiry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enquiryId: "nonexistent-enquiry",
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Enquiry not found");
  });

  it("should return 403 if enquiry doesn't belong to user's company", async () => {
    authenticateAs();

    mockPrisma.enquiry.findUnique.mockResolvedValue({
      id: "enquiry-1",
      clientName: "John Doe",
      email: "john@example.com",
      phone: "+1-555-0101",
      enquiryType: "Work Visa",
      notes: "Test",
      companyId: "different-company",
      followUpDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      application: null,
    } as any);

    const request = new NextRequest(
      "http://localhost:3000/api/applications/from-enquiry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enquiryId: "enquiry-1",
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(403);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Forbidden");
  });

  it("should return 400 if enquiry already has application", async () => {
    authenticateAs();

    mockPrisma.enquiry.findUnique.mockResolvedValue({
      id: "enquiry-1",
      clientName: "John Doe",
      email: "john@example.com",
      phone: "+1-555-0101",
      enquiryType: "Work Visa",
      notes: "Test",
      companyId: "company-1",
      followUpDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      application: { id: "app-1" },
    } as any);

    const request = new NextRequest(
      "http://localhost:3000/api/applications/from-enquiry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enquiryId: "enquiry-1",
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("This enquiry already has an application");
  });

  it("should create application successfully from enquiry", async () => {
    authenticateAs();

    mockPrisma.enquiry.findUnique.mockResolvedValue({
      id: "enquiry-1",
      clientName: "John Doe",
      email: "john@example.com",
      phone: "+1-555-0101",
      enquiryType: "Work Visa",
      notes: "Test enquiry",
      companyId: "company-1",
      followUpDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      application: null,
    } as any);

    const mockApplication = {
      id: "app-1",
      clientFullName: "John Doe",
      applicationType: "Work Visa",
      email: "john@example.com",
      phone: "+1-555-0101",
      notes: "Test enquiry",
      paymentStatus: "PENDING",
      currentStatus: "IN_PROCESS",
      dueDate: null,
      assignedEmployeeId: null,
      companyId: "company-1",
      enquiryId: "enquiry-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.application.create.mockResolvedValue(mockApplication as any);

    const request = new NextRequest(
      "http://localhost:3000/api/applications/from-enquiry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enquiryId: "enquiry-1",
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.clientFullName).toBe("John Doe");
    expect(json.data.applicationType).toBe("Work Visa");
    expect(json.data.enquiryId).toBe("enquiry-1");
    expect(json.data.paymentStatus).toBe("PENDING");
    expect(json.data.currentStatus).toBe("IN_PROCESS");
  });
});
