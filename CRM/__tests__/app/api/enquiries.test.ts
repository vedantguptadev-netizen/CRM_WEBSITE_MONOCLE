/**
 * @jest-environment node
 */

import { POST, GET } from "@/app/api/enquiries/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── Mocks ──────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: {
    enquiry: {
      create: jest.fn(),
      findMany: jest.fn(),
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

describe("GET /api/enquiries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    clearAuth();
    const request = new NextRequest("http://localhost:3000/api/enquiries");
    const response = await GET(request);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Unauthorized");
  });

  it("should return enquiries for authenticated user", async () => {
    authenticateAs("company-1");
    const mockEnquiries = [
      { id: "e1", clientName: "Alice", companyId: "company-1" },
    ];
    mockPrisma.enquiry.findMany.mockResolvedValueOnce(mockEnquiries as any);

    const request = new NextRequest("http://localhost:3000/api/enquiries");
    const response = await GET(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(1);
    expect(json.data[0].clientName).toBe("Alice");
  });

  it("should scope query to user's companyId", async () => {
    authenticateAs("company-42");
    mockPrisma.enquiry.findMany.mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost:3000/api/enquiries");
    await GET(request);

    expect(mockPrisma.enquiry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { companyId: "company-42" } }),
    );
  });
});

describe("POST /api/enquiries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authenticateAs("company-1");
  });

  describe("Auth", () => {
    it("should return 401 when not authenticated", async () => {
      clearAuth();
      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({ clientName: "John", enquiryType: "visa" }),
      });
      const response = await POST(request);
      expect(response.status).toBe(401);
    });
  });

  describe("Validation", () => {
    it("should return 400 if clientName is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({ enquiryType: "visa" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
    });

    it("should return 400 if enquiryType is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({ clientName: "John Doe" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
    });

    it("should return 400 if clientName is empty string", async () => {
      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({ clientName: "", enquiryType: "visa" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
    });
  });

  describe("Success Cases", () => {
    it("should create enquiry with all fields", async () => {
      const mockEnquiry = {
        id: "enquiry-1",
        clientName: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        enquiryType: "visa",
        notes: "Urgent case",
        companyId: "company-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        application: null,
      };

      mockPrisma.enquiry.create.mockResolvedValueOnce(mockEnquiry as any);

      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          clientName: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          enquiryType: "visa",
          notes: "Urgent case",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data).toMatchObject({
        id: "enquiry-1",
        clientName: "John Doe",
        enquiryType: "visa",
      });
    });

    it("should create enquiry with only required fields", async () => {
      const mockEnquiry = {
        id: "enquiry-2",
        clientName: "Jane Smith",
        email: null,
        phone: null,
        enquiryType: "consultation",
        notes: null,
        companyId: "company-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        application: null,
      };

      mockPrisma.enquiry.create.mockResolvedValueOnce(mockEnquiry as any);

      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          clientName: "Jane Smith",
          enquiryType: "consultation",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.clientName).toBe("Jane Smith");
      expect(json.data.email).toBeNull();
    });

    it("should use companyId from JWT token, not from body", async () => {
      authenticateAs("jwt-company-99");
      mockPrisma.enquiry.create.mockResolvedValueOnce({ id: "e" } as any);

      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          clientName: "John Doe",
          enquiryType: "visa",
        }),
      });

      await POST(request);

      expect(mockPrisma.enquiry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ companyId: "jwt-company-99" }),
        }),
      );
    });

    it("should trim whitespace from clientName and enquiryType", async () => {
      mockPrisma.enquiry.create.mockResolvedValueOnce({
        id: "enquiry-3",
        clientName: "John Doe",
        enquiryType: "visa",
      } as any);

      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          clientName: "  John Doe  ",
          enquiryType: "  visa  ",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);

      expect(mockPrisma.enquiry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            clientName: "John Doe",
            enquiryType: "visa",
          }),
        }),
      );
    });
  });

  describe("Error Handling", () => {
    it("should return 500 on Prisma error", async () => {
      mockPrisma.enquiry.create.mockRejectedValueOnce(
        new Error("Database error"),
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          clientName: "John Doe",
          enquiryType: "visa",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.message).toBe("Failed to create enquiry");

      consoleErrorSpy.mockRestore();
    });

    it("should handle invalid JSON in request body", async () => {
      const response = await POST(
        new NextRequest("http://localhost:3000/api/enquiries", {
          method: "POST",
          body: "invalid json",
        }),
      );

      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.success).toBe(false);
    });
  });

  describe("Response Format", () => {
    it("should return correct success response format", async () => {
      const mockEnquiry = {
        id: "enquiry-1",
        clientName: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        enquiryType: "visa",
        notes: "Test notes",
        companyId: "company-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        application: null,
      };

      mockPrisma.enquiry.create.mockResolvedValueOnce(mockEnquiry as any);

      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          clientName: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          enquiryType: "visa",
          notes: "Test notes",
        }),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(json).toHaveProperty("success");
      expect(json).toHaveProperty("data");
      expect(json.success).toBe(true);
      expect(typeof json.data).toBe("object");
    });

    it("should return correct error response format", async () => {
      const request = new NextRequest("http://localhost:3000/api/enquiries", {
        method: "POST",
        body: JSON.stringify({ enquiryType: "visa" }),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(json).toHaveProperty("success");
      expect(json).toHaveProperty("message");
      expect(json.success).toBe(false);
      expect(typeof json.message).toBe("string");
    });
  });
});
