import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import ResponsiveLayout from "@/components/ResponsiveLayout";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

// Mock child components
jest.mock("@/components/Sidebar", () => {
  return function MockSidebar() {
    return <div data-testid="desktop-sidebar">Desktop Sidebar</div>;
  };
});

jest.mock("@/components/MobileHeader", () => {
  return function MockMobileHeader() {
    return <div data-testid="mobile-header">Mobile Header</div>;
  };
});

jest.mock("@/components/MobileSidebar", () => {
  return function MockMobileSidebar() {
    return <div data-testid="mobile-sidebar">Mobile Sidebar</div>;
  };
});

describe("ResponsiveLayout Component", () => {
  it("renders desktop sidebar", () => {
    render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>,
    );
    const sidebar = screen.getByTestId("desktop-sidebar");
    expect(sidebar).toBeInTheDocument();
  });

  it("renders mobile header", () => {
    render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>,
    );
    const header = screen.getByTestId("mobile-header");
    expect(header).toBeInTheDocument();
  });

  it("renders mobile sidebar", () => {
    render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>,
    );
    const sidebar = screen.getByTestId("mobile-sidebar");
    expect(sidebar).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <ResponsiveLayout>
        <div>Test Content Here</div>
      </ResponsiveLayout>,
    );
    const content = screen.getByText("Test Content Here");
    expect(content).toBeInTheDocument();
  });

  it("has responsive padding classes", () => {
    const { container } = render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>,
    );
    const contentWrapper = container.querySelector(".p-6");
    expect(contentWrapper).toBeInTheDocument();
  });

  it("has main element with overflow-auto", () => {
    const { container } = render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>,
    );
    const main = container.querySelector("main");
    expect(main).toHaveClass("overflow-auto");
  });

  it("has margin-left for desktop", () => {
    const { container } = render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>,
    );
    const main = container.querySelector("main");
    expect(main).toHaveClass("md:ml-60");
  });

  it("has top padding for mobile", () => {
    const { container } = render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>,
    );
    const main = container.querySelector("main");
    expect(main).toHaveClass("pt-16");
  });

  it("removes top padding on desktop", () => {
    const { container } = render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>,
    );
    const main = container.querySelector("main");
    expect(main).toHaveClass("md:pt-0");
  });
});
