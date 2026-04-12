/**
 * @jest-environment node
 */

import { POST, GET } from "@/app/api/applications/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── Mocks ──────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: {
    application: {
      create: jest.fn(),
      findMany: jest.fn(),
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

describe("POST /api/applications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no token provided", async () => {
    clearAuth();
    const request = new NextRequest("http://localhost:3000/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Unauthorized");
  });

  it("should return 400 for validation errors", async () => {
    authenticateAs();

    const request = new NextRequest("http://localhost:3000/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Missing clientFullName which is required
        applicationType: "Work Visa",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.success).toBe(false);
  });

  it("should create an application successfully", async () => {
    authenticateAs();

    const mockApplication = {
      id: "app-1",
      clientFullName: "John Doe",
      applicationType: "Work Visa",
      email: "john@example.com",
      phone: "+1-555-0101",
      notes: "Test application",
      paymentStatus: "PENDING",
      currentStatus: "IN_PROCESS",
      dueDate: null,
      assignedEmployeeId: null,
      companyId: "company-1",
      enquiryId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.application.create.mockResolvedValue(mockApplication as any);

    const request = new NextRequest("http://localhost:3000/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientFullName: "John Doe",
        applicationType: "Work Visa",
        email: "john@example.com",
        phone: "+1-555-0101",
        notes: "Test application",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.clientFullName).toBe("John Doe");
    expect(json.data.companyId).toBe("company-1");
  });
});

describe("GET /api/applications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no token provided", async () => {
    clearAuth();
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("should fetch all applications for company", async () => {
    authenticateAs();

    const mockApplications = [
      {
        id: "app-1",
        clientFullName: "John Doe",
        applicationType: "Work Visa",
        email: "john@example.com",
        phone: "+1-555-0101",
        paymentStatus: "PENDING",
        currentStatus: "IN_PROCESS",
        dueDate: null,
        companyId: "company-1",
        enquiryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPrisma.application.findMany.mockResolvedValue(mockApplications as any);

    const response = await GET();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(1);
    expect(json.data[0].clientFullName).toBe("John Doe");
  });
});
