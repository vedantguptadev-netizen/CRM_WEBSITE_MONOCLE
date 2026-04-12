import { JWTPayload } from "./auth-context";

/**
 * Decodes a JWT token without verification (client-side only)
 * The token is verified on the server side via middleware
 */
export function jwtDecode(token: string): JWTPayload | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));

    return {
      userId: decoded.userId,
      email: decoded.email,
      companyId: decoded.companyId,
    };
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}
