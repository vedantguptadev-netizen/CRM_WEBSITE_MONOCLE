import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

/**
 * Get the current authenticated user from the request cookies (server-side only)
 */
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    return payload || null;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}
