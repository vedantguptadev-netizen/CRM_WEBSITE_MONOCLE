import {
  signToken,
  verifyToken,
  extractTokenFromHeader,
  JWTPayload,
} from "@/lib/jwt";
import jwt from "jsonwebtoken";

describe("JWT Utility Functions", () => {
  const testPayload: JWTPayload = {
    userId: "user-123",
    email: "test@example.com",
    companyId: "company-456",
  };

  describe("signToken", () => {
    it("should create a valid JWT token", () => {
      const token = signToken(testPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3); // JWT has 3 parts
    });

    it("should encode the payload correctly", () => {
      const token = signToken(testPayload);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key-change-in-production",
      ) as JWTPayload;

      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.companyId).toBe(testPayload.companyId);
    });

    it("should create different tokens for different payloads", () => {
      const token1 = signToken(testPayload);
      const token2 = signToken({ ...testPayload, userId: "user-789" });

      expect(token1).not.toBe(token2);
    });

    it("should set expiration time", () => {
      const token = signToken(testPayload);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key-change-in-production",
      ) as any;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp > decoded.iat).toBe(true);
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid token", () => {
      const token = signToken(testPayload);
      const decoded = verifyToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(testPayload.userId);
      expect(decoded?.email).toBe(testPayload.email);
      expect(decoded?.companyId).toBe(testPayload.companyId);
    });

    it("should return null for invalid token", () => {
      const decoded = verifyToken("invalid.token.here");

      expect(decoded).toBeNull();
    });

    it("should return null for expired token", () => {
      // Create a token that expires in -1 second (already expired)
      const expiredToken = jwt.sign(
        testPayload,
        process.env.JWT_SECRET || "your-secret-key-change-in-production",
        {
          expiresIn: "-1s",
        },
      );

      const decoded = verifyToken(expiredToken);

      expect(decoded).toBeNull();
    });

    it("should return null for tampered token", () => {
      const token = signToken(testPayload);
      const tamperedToken = token.slice(0, -5) + "xxxxx"; // Change last 5 chars

      const decoded = verifyToken(tamperedToken);

      expect(decoded).toBeNull();
    });

    it("should return null for empty string", () => {
      const decoded = verifyToken("");

      expect(decoded).toBeNull();
    });
  });

  describe("extractTokenFromHeader", () => {
    it("should extract token from Authorization header", () => {
      const token = signToken(testPayload);
      const header = `Bearer ${token}`;

      const extracted = extractTokenFromHeader(header);

      expect(extracted).toBe(token);
    });

    it("should return null for null header", () => {
      const extracted = extractTokenFromHeader(null);

      expect(extracted).toBeNull();
    });

    it("should return null for empty string", () => {
      const extracted = extractTokenFromHeader("");

      expect(extracted).toBeNull();
    });

    it("should return null for malformed header without Bearer", () => {
      const token = signToken(testPayload);

      const extracted = extractTokenFromHeader(token);

      expect(extracted).toBeNull();
    });

    it("should return null for malformed Bearer header", () => {
      const extracted = extractTokenFromHeader("Bearer");

      expect(extracted).toBeNull();
    });

    it("should return null for wrong auth type", () => {
      const token = signToken(testPayload);

      const extracted = extractTokenFromHeader(`Basic ${token}`);

      expect(extracted).toBeNull();
    });

    it("should handle multiple spaces", () => {
      const token = signToken(testPayload);

      const extracted = extractTokenFromHeader(`Bearer  ${token}`);

      expect(extracted).toBeNull();
    });
  });

  describe("End-to-end token flow", () => {
    it("should sign, extract, and verify token successfully", () => {
      // Sign token
      const token = signToken(testPayload);

      // Extract from header
      const header = `Bearer ${token}`;
      const extracted = extractTokenFromHeader(header);

      // Verify
      const decoded = verifyToken(extracted!);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(testPayload.userId);
      expect(decoded?.email).toBe(testPayload.email);
      expect(decoded?.companyId).toBe(testPayload.companyId);
    });
  });
});
