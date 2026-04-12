/**
 * @jest-environment node
 */

import { NextResponse } from "next/server";
import { GET } from "@/app/api/companies/route";
import { prisma } from "@/lib/prisma";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    company: {
      findMany: jest.fn(),
    },
  },
}));

describe("GET /api/companies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return companies sorted by createdAt descending", async () => {
    // Mock data - Note: Dates will be serialized to ISO strings in JSON response
    const mockCompanies = [
      {
        id: 1,
        name: "Company A",
        createdAt: new Date("2026-03-08"),
      },
      {
        id: 2,
        name: "Company B",
        createdAt: new Date("2026-03-07"),
      },
      {
        id: 3,
        name: "Company C",
        createdAt: new Date("2026-03-06"),
      },
    ];

    (prisma.company.findMany as jest.Mock).mockResolvedValueOnce(mockCompanies);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(3);
    // Check first company details (dates are serialized as ISO strings)
    expect(data.data[0].id).toBe(1);
    expect(data.data[0].name).toBe("Company A");
    // Check ordering (most recent first)
    expect(data.data[0].createdAt).toEqual("2026-03-08T00:00:00.000Z");
    expect(data.data[1].createdAt).toEqual("2026-03-07T00:00:00.000Z");
    expect(data.data[2].createdAt).toEqual("2026-03-06T00:00:00.000Z");
  });

  it("should pass correct orderBy parameter to Prisma", async () => {
    const mockCompanies = [
      {
        id: 1,
        name: "Company A",
        createdAt: new Date("2026-03-08"),
      },
    ];

    (prisma.company.findMany as jest.Mock).mockResolvedValueOnce(mockCompanies);

    await GET();

    expect(prisma.company.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("should return empty array when no companies exist", async () => {
    (prisma.company.findMany as jest.Mock).mockResolvedValueOnce([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual([]);
  });

  it("should return error when Prisma throws an exception", async () => {
    const error = new Error("Database connection failed");
    (prisma.company.findMany as jest.Mock).mockRejectedValueOnce(error);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Failed to fetch companies");
  });

  it("should handle general errors gracefully", async () => {
    (prisma.company.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("Unexpected error"),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Failed to fetch companies");
  });

  it("should return correct response format on success", async () => {
    const mockCompanies = [
      { id: 1, name: "Test Company", createdAt: new Date() },
    ];

    (prisma.company.findMany as jest.Mock).mockResolvedValueOnce(mockCompanies);

    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty("success");
    expect(data).toHaveProperty("data");
    expect(typeof data.success).toBe("boolean");
    expect(Array.isArray(data.data)).toBe(true);
  });

  it("should return correct response format on error", async () => {
    (prisma.company.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("DB Error"),
    );

    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty("success");
    expect(data).toHaveProperty("message");
    expect(data.success).toBe(false);
  });

  it("should log error to console on failure", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const error = new Error("Database error");

    (prisma.company.findMany as jest.Mock).mockRejectedValueOnce(error);

    await GET();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching companies:",
      error,
    );

    consoleErrorSpy.mockRestore();
  });

  it("should handle multiple companies correctly", async () => {
    const mockCompanies = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Company ${i + 1}`,
      createdAt: new Date(Date.now() - i * 1000 * 60 * 60),
    }));

    (prisma.company.findMany as jest.Mock).mockResolvedValueOnce(mockCompanies);

    const response = await GET();
    const data = await response.json();

    expect(data.data).toHaveLength(10);
    expect(data.success).toBe(true);
  });
});
