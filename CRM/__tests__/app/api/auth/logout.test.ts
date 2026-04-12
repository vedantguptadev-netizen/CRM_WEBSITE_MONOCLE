/**
 * @jest-environment node
 */
import { POST } from "@/app/api/auth/logout/route";
import { NextRequest } from "next/server";

describe("/api/auth/logout", () => {
  it("returns 200 on successful logout", async () => {
    const mockRequest = {} as NextRequest;
    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Logged out");
  });

  it("clears the authToken cookie", async () => {
    const mockRequest = {} as NextRequest;
    const response = await POST(mockRequest);

    // Check if the Set-Cookie header contains authToken with maxAge=0
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("authToken");
    expect(setCookie).toContain("Max-Age=0");
  });

  it("sets HttpOnly flag on cookie clear", async () => {
    const mockRequest = {} as NextRequest;
    const response = await POST(mockRequest);

    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("HttpOnly");
  });

  it("sets SameSite=Lax on cookie clear", async () => {
    const mockRequest = {} as NextRequest;
    const response = await POST(mockRequest);

    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("SameSite=lax");
  });
});
