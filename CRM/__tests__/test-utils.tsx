/**
 * Test utilities for rendering components with necessary providers
 */
import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AuthProvider } from "@/lib/auth-context";

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: false,
    status: 401,
    json: async () => ({}),
  }),
) as jest.Mock;

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/crm/dashboard",
}));

// Add any providers your components might need
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
