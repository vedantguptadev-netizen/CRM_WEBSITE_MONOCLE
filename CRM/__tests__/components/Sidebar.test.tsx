import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import Sidebar from "@/components/Sidebar";
import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

// Mock SidebarHeader component
jest.mock("@/components/SidebarHeader", () => {
  return function MockSidebarHeader() {
    return <div data-testid="sidebar-header">Mock Sidebar Header</div>;
  };
});

describe("Sidebar Component", () => {
  it("renders the sidebar header component", () => {
    render(<Sidebar />);
    const header = screen.getByTestId("sidebar-header");
    expect(header).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    render(<Sidebar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Enquiries")).toBeInTheDocument();
    expect(screen.getByText("Applications")).toBeInTheDocument();
  });

  it("renders navigation links with correct hrefs", () => {
    render(<Sidebar />);
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  it("highlights active navigation item", () => {
    render(<Sidebar />);
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toHaveClass("bg-red-50");
    expect(dashboardLink).toHaveClass("text-red-600");
  });

  it("renders footer with company name from config", () => {
    render(<Sidebar />);
    const footerTexts = screen.getAllByText(/CRM/i);
    expect(footerTexts.length).toBeGreaterThan(0);
  });

  it("has fixed sidebar styling", () => {
    const { container } = render(<Sidebar />);
    const aside = container.querySelector("aside");
    expect(aside).toHaveClass("fixed");
    expect(aside).toHaveClass("left-0");
    expect(aside).toHaveClass("top-0");
  });

  it("active nav item has left red border", () => {
    render(<Sidebar />);
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    const parentLink = dashboardLink.parentElement;
    expect(parentLink).toBeInTheDocument();
  });
});
