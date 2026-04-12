/**
 * @jest-environment node
 */
import { GET } from "@/app/api/auth/me/route";
import { NextRequest } from "next/server";
import { signToken } from "@/lib/jwt";

// Mock the jwt module
jest.mock("@/lib/jwt", () => ({
  signToken: jest.fn(),
  verifyToken: jest.fn(),
  extractTokenFromHeader: jest.fn(),
}));

import { verifyToken } from "@/lib/jwt";

describe("/api/auth/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when no token is present", async () => {
    // Mock request without authToken cookie
    const mockRequest = {
      cookies: new Map(),
    } as any;

    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toContain("No authentication token found");
  });

  it("returns 401 when token is invalid", async () => {
    // Mock request with invalid token
    const mockCookies = new Map([["authToken", "invalid-token"]]);
    const mockRequest = {
      cookies: {
        get: (name: string) => {
          const value = mockCookies.get(name);
          return value ? { value } : undefined;
        },
      },
    } as any;

    // Mock verifyToken to return null for invalid token
    (verifyToken as jest.Mock).mockReturnValue(null);

    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("returns user data when token is valid", async () => {
    const testPayload = {
      userId: "user-123",
      email: "test@immigration.com",
      companyId: "company-123",
    };

    // Mock request with valid token
    const mockCookies = new Map([["authToken", "valid-token"]]);
    const mockRequest = {
      cookies: {
        get: (name: string) => {
          const value = mockCookies.get(name);
          return value ? { value } : undefined;
        },
      },
    } as any;

    // Mock verifyToken to return valid payload
    (verifyToken as jest.Mock).mockReturnValue(testPayload);

    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.userId).toBe("user-123");
    expect(data.email).toBe("test@immigration.com");
    expect(data.companyId).toBe("company-123");
  });

  it("does not include sensitive data in response", async () => {
    const testPayload = {
      userId: "user-123",
      email: "test@immigration.com",
      companyId: "company-123",
    };

    const mockCookies = new Map([["authToken", "valid-token"]]);
    const mockRequest = {
      cookies: {
        get: (name: string) => {
          const value = mockCookies.get(name);
          return value ? { value } : undefined;
        },
      },
    } as any;

    (verifyToken as jest.Mock).mockReturnValue(testPayload);

    const response = await GET(mockRequest);
    const data = await response.json();

    // Verify sensitive data is not included
    expect(data.password).toBeUndefined();
    expect(data.token).toBeUndefined();
  });
});
