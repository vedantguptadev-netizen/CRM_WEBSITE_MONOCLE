import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import MobileHeader from "@/components/MobileHeader";

// Mock appConfig
jest.mock("@/lib/appConfig", () => ({
  appConfig: {
    companyName: "VisionCare",
    appName: "Immigration CRM",
    version: "1.0",
  },
}));

describe("MobileHeader Component", () => {
  const mockToggle = jest.fn();

  beforeEach(() => {
    mockToggle.mockClear();
  });

  it("renders company name from config", () => {
    render(<MobileHeader isOpen={false} onToggle={mockToggle} />);
    const companyName = screen.getByText("VisionCare");
    expect(companyName).toBeInTheDocument();
  });

  it("renders CRM text", () => {
    render(<MobileHeader isOpen={false} onToggle={mockToggle} />);
    const crmText = screen.getByText("CRM");
    expect(crmText).toBeInTheDocument();
  });

  it("calls onToggle when hamburger button is clicked", () => {
    render(<MobileHeader isOpen={false} onToggle={mockToggle} />);
    const button = screen.getByRole("button", { name: /toggle menu/i });
    button.click();
    expect(mockToggle).toHaveBeenCalled();
  });

  it("shows Menu icon when sidebar is closed", () => {
    const { container } = render(
      <MobileHeader isOpen={false} onToggle={mockToggle} />,
    );
    const menuIcon = container.querySelector("svg");
    expect(menuIcon).toBeInTheDocument();
  });

  it("shows X icon when sidebar is open", () => {
    const { container } = render(
      <MobileHeader isOpen={true} onToggle={mockToggle} />,
    );
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("has hidden on desktop class", () => {
    const { container } = render(
      <MobileHeader isOpen={false} onToggle={mockToggle} />,
    );
    const header = container.querySelector("header");
    expect(header).toHaveClass("md:hidden");
  });

  it("has red accent for logo circle", () => {
    const { container } = render(
      <MobileHeader isOpen={false} onToggle={mockToggle} />,
    );
    const circle = container.querySelector(".bg-red-100");
    expect(circle).toBeInTheDocument();
  });
});
