import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import MobileSidebar from "@/components/MobileSidebar";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

// Mock SidebarHeader component
jest.mock("@/components/SidebarHeader", () => {
  return function MockSidebarHeader() {
    return <div data-testid="sidebar-header">Mock Header</div>;
  };
});

describe("MobileSidebar Component", () => {
  const mockClose = jest.fn();

  beforeEach(() => {
    mockClose.mockClear();
  });

  it("renders navigation items", () => {
    render(<MobileSidebar isOpen={true} onClose={mockClose} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Enquiries")).toBeInTheDocument();
    expect(screen.getByText("Applications")).toBeInTheDocument();
  });

  it("renders sidebar header", () => {
    render(<MobileSidebar isOpen={true} onClose={mockClose} />);
    const header = screen.getByTestId("sidebar-header");
    expect(header).toBeInTheDocument();
  });

  it("shows close button", () => {
    render(<MobileSidebar isOpen={true} onClose={mockClose} />);
    const closeButton = screen.getByRole("button", { name: /close menu/i });
    expect(closeButton).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<MobileSidebar isOpen={true} onClose={mockClose} />);
    const closeButton = screen.getByRole("button", { name: /close menu/i });
    closeButton.click();
    expect(mockClose).toHaveBeenCalled();
  });

  it("renders backdrop when open", () => {
    const { container } = render(
      <MobileSidebar isOpen={true} onClose={mockClose} />,
    );
    const backdrop = container.querySelector(".bg-black\\/50");
    expect(backdrop).toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", () => {
    const { container } = render(
      <MobileSidebar isOpen={true} onClose={mockClose} />,
    );
    const backdrop = container.querySelector(".bg-black\\/50");
    if (backdrop) {
      backdrop.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      expect(mockClose).toHaveBeenCalled();
    }
  });

  it("has translate-x-0 when open", () => {
    const { container } = render(
      <MobileSidebar isOpen={true} onClose={mockClose} />,
    );
    const aside = container.querySelector("aside");
    expect(aside).toHaveClass("translate-x-0");
  });

  it("has -translate-x-full when closed", () => {
    const { container } = render(
      <MobileSidebar isOpen={false} onClose={mockClose} />,
    );
    const aside = container.querySelector("aside");
    expect(aside).toHaveClass("-translate-x-full");
  });

  it("closes sidebar when a nav link is clicked", () => {
    render(<MobileSidebar isOpen={true} onClose={mockClose} />);
    const link = screen.getByRole("link", { name: /dashboard/i });
    link.click();
    expect(mockClose).toHaveBeenCalled();
  });

  it("highlights active navigation item with red styling", () => {
    render(<MobileSidebar isOpen={true} onClose={mockClose} />);
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toHaveClass("bg-red-50");
    expect(dashboardLink).toHaveClass("text-red-600");
  });

  it("has hidden on desktop class for entire sidebar", () => {
    const { container } = render(
      <MobileSidebar isOpen={true} onClose={mockClose} />,
    );
    const aside = container.querySelector("aside");
    expect(aside).toHaveClass("md:hidden");
  });
});
