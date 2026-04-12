import { renderHook, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth, type JWTPayload } from "@/lib/auth-context";

// Mock global fetch
global.fetch = jest.fn();

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides initial loading state", () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("sets user data when token is valid", async () => {
    const mockUser = {
      userId: "user-123",
      email: "test@immigration.com",
      companyId: "company-123",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockUser,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("sets user to null when token is invalid", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("calls logout endpoint and clears user on logout", async () => {
    const mockUser = {
      userId: "user-123",
      email: "test@immigration.com",
      companyId: "company-123",
    };

    // First call to /api/auth/me (on mount)
    // Second call to /api/auth/logout (when logout is called)
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, message: "Logged out" }),
      });

    // Mock useRouter
    jest.mock("next/navigation", () => ({
      useRouter: () => ({
        push: jest.fn(),
      }),
    }));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user?.userId).toBe("user-123");

    // Call logout
    await result.current.logout();

    // Verify logout endpoint was called
    expect(fetch).toHaveBeenCalledWith("/api/auth/logout", { method: "POST" });

    // User should be cleared
    await waitFor(() => {
      expect(result.current.user).toBe(null);
    });
  });

  it("throws error when useAuth is used outside AuthProvider", () => {
    // Suppress console.error for this test
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleError.mockRestore();
  });

  it("calls /api/auth/me on provider mount", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        userId: "user-123",
        email: "test@immigration.com",
        companyId: "company-123",
      }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/auth/me");
    });
  });
});
