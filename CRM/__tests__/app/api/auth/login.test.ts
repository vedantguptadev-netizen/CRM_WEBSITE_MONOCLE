/**
 * @jest-environment node
 */
import { POST } from "@/app/api/auth/login/route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Validation Tests
  it("should return 400 if email is missing", async () => {
    const request = {
      json: async () => ({ password: "password123" }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Email and password are required");
  });

  it("should return 400 if password is missing", async () => {
    const request = {
      json: async () => ({ email: "test@example.com" }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Email and password are required");
  });

  it("should return 400 if both email and password are missing", async () => {
    const request = {
      json: async () => ({}),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  // User Not Found Tests
  it("should return 401 if user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const request = {
      json: async () => ({
        email: "notfound@example.com",
        password: "password123",
      }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Invalid credentials");
  });

  // Invalid Password Tests
  it("should return 401 if password is incorrect", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user-123",
      email: "test@example.com",
      password: "hashedpassword123",
      companyId: "company-123",
      company: { id: "company-123", name: "Test Company" },
    });

    const request = {
      json: async () => ({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Invalid credentials");
  });

  // Successful Login Tests
  it("should return 200 with success and companyId on valid credentials", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      password: "password123",
      companyId: "company-456",
      company: { id: "company-456", name: "Test Company" },
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

    const request = {
      json: async () => ({
        email: "test@example.com",
        password: "password123",
      }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.companyId).toBe("company-456");
    expect(data.userId).toBe("user-123");
    // Token is now set as HTTP-only cookie, not in response body
    expect(data.token).toBeUndefined();
  });

  it("should set JWT token as HTTP-only cookie on successful login", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      password: "password123",
      companyId: "company-456",
      company: { id: "company-456", name: "Test Company" },
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

    const request = {
      json: async () => ({
        email: "test@example.com",
        password: "password123",
      }),
    } as NextRequest;

    const response = await POST(request);

    // Check that authToken cookie is set
    const setCookieHeader = response.headers.get("set-cookie");
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader).toContain("authToken=");
    expect(setCookieHeader).toContain("HttpOnly");
  });

  it("should query user with email", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const request = {
      json: async () => ({
        email: "test@example.com",
        password: "password123",
      }),
    } as NextRequest;

    await POST(request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      include: { company: true },
    });
  });

  // Case Sensitivity Tests
  it("should treat passwords as case-sensitive", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user-123",
      email: "test@example.com",
      password: "Password123",
      companyId: "company-123",
    });

    const request = {
      json: async () => ({
        email: "test@example.com",
        password: "password123",
      }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.message).toBe("Invalid credentials");
  });

  // Multiple Login Attempts
  it("should return correct response on multiple login attempts", async () => {
    // First attempt - wrong password
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user-123",
      email: "test@example.com",
      password: "password123",
      companyId: "company-123",
    });

    const failRequest = {
      json: async () => ({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    } as NextRequest;

    const failResponse = await POST(failRequest);
    const failData = await failResponse.json();

    expect(failData.success).toBe(false);

    // Second attempt - correct password
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user-123",
      email: "test@example.com",
      password: "password123",
      companyId: "company-123",
    });

    const successRequest = {
      json: async () => ({
        email: "test@example.com",
        password: "password123",
      }),
    } as NextRequest;

    const successResponse = await POST(successRequest);
    const successData = await successResponse.json();

    expect(successData.success).toBe(true);
    expect(successData.companyId).toBe("company-123");
  });

  // Error Handling Tests
  it("should return 500 on database error", async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(
      new Error("Database connection failed"),
    );

    const request = {
      json: async () => ({
        email: "test@example.com",
        password: "password123",
      }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Internal server error");
  });

  it("should return 500 on JSON parsing error", async () => {
    const request = {
      json: async () => {
        throw new Error("Invalid JSON");
      },
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Internal server error");
  });

  // Response Structure Tests
  it("should include userId in success response", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user-789",
      email: "test@example.com",
      password: "password123",
      companyId: "company-123",
    });

    const request = {
      json: async () => ({
        email: "test@example.com",
        password: "password123",
      }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(data).toHaveProperty("userId");
    expect(data.userId).toBe("user-789");
  });

  it("should not expose password in response", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "user-123",
      email: "test@example.com",
      password: "password123",
      companyId: "company-123",
    });

    const request = {
      json: async () => ({
        email: "test@example.com",
        password: "password123",
      }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(data).not.toHaveProperty("password");
  });

  // Edge Cases
  it("should handle empty string email", async () => {
    const request = {
      json: async () => ({ email: "", password: "password123" }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("should handle empty string password", async () => {
    const request = {
      json: async () => ({ email: "test@example.com", password: "" }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("should handle whitespace-only email", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const request = {
      json: async () => ({ email: "   ", password: "password123" }),
    } as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
  });
});
