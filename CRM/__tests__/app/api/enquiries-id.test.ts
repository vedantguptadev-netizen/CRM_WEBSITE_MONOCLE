/**
 * @jest-environment node
 */

import { GET, PUT, DELETE } from "@/app/api/enquiries/[id]/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── Mocks ──────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: {
    enquiry: {
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

const mockEnquiry = {
  id: "enq-1",
  clientName: "Alice Johnson",
  dateOfBirth: new Date("1990-06-15"),
  email: "alice@example.com",
  phone: "+1-555-0199",
  enquiryType: "study_permit",
  customEnquiryType: "SDS stream",
  notes: "Interested in Fall 2026",
  followUpDate: new Date("2026-05-01"),
  companyId: "company-1",
  application: null,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

const params = { params: { id: "enq-1" } };

// ─── GET /api/enquiries/[id] ────────────────────────────────────

describe("GET /api/enquiries/[id]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    clearAuth();
    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1");
    const res = await GET(req, params);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Unauthorized");
  });

  it("returns 404 when enquiry not found", async () => {
    authenticateAs();
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1");
    const res = await GET(req, params);
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.message).toBe("Enquiry not found");
  });

  it("returns 403 when enquiry belongs to different company", async () => {
    authenticateAs("company-2");
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(mockEnquiry);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1");
    const res = await GET(req, params);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.message).toBe("Forbidden");
  });

  it("returns enquiry for authorized user", async () => {
    authenticateAs("company-1");
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(mockEnquiry);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1");
    const res = await GET(req, params);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.clientName).toBe("Alice Johnson");
  });

  it("returns 500 on database error", async () => {
    authenticateAs();
    (mockPrisma.enquiry.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1");
    const res = await GET(req, params);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Failed to fetch enquiry");
  });
});

// ─── PUT /api/enquiries/[id] ────────────────────────────────────

describe("PUT /api/enquiries/[id]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    clearAuth();
    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName: "Updated" }),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(401);
  });

  it("returns 404 when enquiry not found", async () => {
    authenticateAs();
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName: "Updated" }),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(404);
  });

  it("returns 403 when enquiry belongs to different company", async () => {
    authenticateAs("company-2");
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(mockEnquiry);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName: "Updated" }),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid data", async () => {
    authenticateAs();
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(mockEnquiry);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("updates enquiry successfully", async () => {
    authenticateAs();
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(mockEnquiry);
    const updated = {
      ...mockEnquiry,
      clientName: "Updated Name",
      application: null,
    };
    (mockPrisma.enquiry.update as jest.Mock).mockResolvedValue(updated);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName: "Updated Name" }),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.clientName).toBe("Updated Name");
  });

  it("updates enquiry type and custom type", async () => {
    authenticateAs();
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(mockEnquiry);
    const updated = {
      ...mockEnquiry,
      enquiryType: "work_permit",
      customEnquiryType: "LMIA-based",
      application: null,
    };
    (mockPrisma.enquiry.update as jest.Mock).mockResolvedValue(updated);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enquiryType: "work_permit",
        customEnquiryType: "LMIA-based",
      }),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.enquiryType).toBe("work_permit");
    expect(json.data.customEnquiryType).toBe("LMIA-based");
  });

  it("returns 500 on database error", async () => {
    authenticateAs();
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(mockEnquiry);
    (mockPrisma.enquiry.update as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName: "Updated" }),
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(500);
  });
});

// ─── DELETE /api/enquiries/[id] ─────────────────────────────────

describe("DELETE /api/enquiries/[id]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    clearAuth();
    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    expect(res.status).toBe(401);
  });

  it("returns 404 when enquiry not found", async () => {
    authenticateAs();
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    expect(res.status).toBe(404);
  });

  it("returns 403 when enquiry belongs to different company", async () => {
    authenticateAs("company-2");
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(mockEnquiry);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    expect(res.status).toBe(403);
  });

  it("deletes enquiry successfully", async () => {
    authenticateAs();
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(mockEnquiry);
    (mockPrisma.enquiry.delete as jest.Mock).mockResolvedValue(mockEnquiry);

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.message).toBe("Enquiry deleted successfully");
  });

  it("returns 500 on database error", async () => {
    authenticateAs();
    (mockPrisma.enquiry.findUnique as jest.Mock).mockResolvedValue(mockEnquiry);
    (mockPrisma.enquiry.delete as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );

    const req = new NextRequest("http://localhost:3000/api/enquiries/enq-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, params);
    expect(res.status).toBe(500);
  });
});
