/**
 * @jest-environment node
 */

import { GET, PUT, DELETE } from "@/app/api/applications/[id]/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── Mocks ──────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: {
    application: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

// ─── Helpers ────────────────────────────────────────────────────

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

const mockApplication = {
  id: "app-1",
  clientFullName: "John Doe",
  applicationType: "Work Visa",
  email: "john@example.com",
  phone: "+1-555-0101",
  notes: "Test notes",
  paymentStatus: "PENDING",
  currentStatus: "IN_PROCESS",
  dueDate: null,
  assignedEmployeeId: null,
  driveFolderLink: null,
  companyId: "company-1",
  enquiryId: null,
  enquiry: null,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

const params = { params: { id: "app-1" } };

// ─── GET /api/applications/[id] ─────────────────────────────────

describe("GET /api/applications/[id]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    clearAuth();
    const req = new NextRequest("http://localhost:3000/api/applications/app-1");
    const res = await GET(req, params);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Unauthorized");
  });

  it("returns 404 when application not found", async () => {
    authenticateAs();
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/applications/app-1");
    const res = await GET(req, params);
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("Application not found");
  });

  it("returns 403 when application belongs to different company", async () => {
    authenticateAs("company-2");
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(
      mockApplication,
    );

    const req = new NextRequest("http://localhost:3000/api/applications/app-1");
    const res = await GET(req, params);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.message).toBe("Forbidden");
  });

  it("returns application for authorized user", async () => {
    authenticateAs("company-1");
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(
      mockApplication,
    );

    const req = new NextRequest("http://localhost:3000/api/applications/app-1");
    const res = await GET(req, params);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.clientFullName).toBe("John Doe");
  });

  it("returns 500 on database error", async () => {
    authenticateAs();
    (mockPrisma.application.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );

    const req = new NextRequest("http://localhost:3000/api/applications/app-1");
    const res = await GET(req, params);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Failed to fetch application");
  });
});

// ─── PUT /api/applications/[id] ─────────────────────────────────

describe("PUT /api/applications/[id]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    clearAuth();
    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientFullName: "Updated Name" }),
      },
    );
    const res = await PUT(req, params);
    expect(res.status).toBe(401);
  });

  it("returns 404 when application not found", async () => {
    authenticateAs();
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientFullName: "Updated" }),
      },
    );
    const res = await PUT(req, params);
    expect(res.status).toBe(404);
  });

  it("returns 403 when application belongs to different company", async () => {
    authenticateAs("company-2");
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(
      mockApplication,
    );

    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientFullName: "Updated" }),
      },
    );
    const res = await PUT(req, params);
    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid data", async () => {
    authenticateAs();
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(
      mockApplication,
    );

    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driveFolderLink: "not-a-url" }),
      },
    );
    const res = await PUT(req, params);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("updates application successfully", async () => {
    authenticateAs();
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(
      mockApplication,
    );
    const updated = {
      ...mockApplication,
      clientFullName: "Updated Name",
      enquiry: null,
    };
    (mockPrisma.application.update as jest.Mock).mockResolvedValue(updated);

    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientFullName: "Updated Name" }),
      },
    );
    const res = await PUT(req, params);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.clientFullName).toBe("Updated Name");
  });

  it("updates status fields correctly", async () => {
    authenticateAs();
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(
      mockApplication,
    );
    const updated = {
      ...mockApplication,
      paymentStatus: "PAID",
      currentStatus: "SUBMITTED",
      enquiry: null,
    };
    (mockPrisma.application.update as jest.Mock).mockResolvedValue(updated);

    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: "PAID",
          currentStatus: "SUBMITTED",
        }),
      },
    );
    const res = await PUT(req, params);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.paymentStatus).toBe("PAID");
    expect(json.data.currentStatus).toBe("SUBMITTED");
  });

  it("returns 500 on database error", async () => {
    authenticateAs();
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(
      mockApplication,
    );
    (mockPrisma.application.update as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );

    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientFullName: "Updated" }),
      },
    );
    const res = await PUT(req, params);
    expect(res.status).toBe(500);
  });
});

// ─── DELETE /api/applications/[id] ──────────────────────────────

describe("DELETE /api/applications/[id]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    clearAuth();
    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "DELETE",
      },
    );
    const res = await DELETE(req, params);
    expect(res.status).toBe(401);
  });

  it("returns 404 when application not found", async () => {
    authenticateAs();
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "DELETE",
      },
    );
    const res = await DELETE(req, params);
    expect(res.status).toBe(404);
  });

  it("returns 403 when application belongs to different company", async () => {
    authenticateAs("company-2");
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(
      mockApplication,
    );

    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "DELETE",
      },
    );
    const res = await DELETE(req, params);
    expect(res.status).toBe(403);
  });

  it("deletes application successfully", async () => {
    authenticateAs();
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(
      mockApplication,
    );
    (mockPrisma.application.delete as jest.Mock).mockResolvedValue(
      mockApplication,
    );

    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "DELETE",
      },
    );
    const res = await DELETE(req, params);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.message).toBe("Application deleted successfully");
  });

  it("returns 500 on database error", async () => {
    authenticateAs();
    (mockPrisma.application.findUnique as jest.Mock).mockResolvedValue(
      mockApplication,
    );
    (mockPrisma.application.delete as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );

    const req = new NextRequest(
      "http://localhost:3000/api/applications/app-1",
      {
        method: "DELETE",
      },
    );
    const res = await DELETE(req, params);
    expect(res.status).toBe(500);
  });
});
