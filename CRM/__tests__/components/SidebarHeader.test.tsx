import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import SidebarHeader from "@/components/SidebarHeader";
import { appConfig } from "@/lib/appConfig";

jest.mock("@/lib/appConfig", () => ({
  appConfig: {
    companyName: "VisionCare",
    appName: "Immigration CRM",
    version: "1.0",
    primaryColor: "red",
    features: {
      enableNotifications: true,
      enableExports: true,
      enableReports: true,
    },
  },
}));

describe("SidebarHeader Component", () => {
  it("renders the company name from config", () => {
    render(<SidebarHeader />);
    const companyName = screen.getByText("VisionCare");
    expect(companyName).toBeInTheDocument();
  });

  it("renders the CRM Dashboard subtitle", () => {
    render(<SidebarHeader />);
    const subtitle = screen.getByText("CRM Dashboard");
    expect(subtitle).toBeInTheDocument();
  });

  it("renders the logo image", () => {
    render(<SidebarHeader />);
    const logo = screen.getByAltText("VisionCare");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src");
  });

  it("renders the logo with proper styling", () => {
    render(<SidebarHeader />);
    const logo = screen.getByAltText("VisionCare");
    expect(logo).toHaveClass("rounded-full");
    expect(logo).toHaveClass("object-contain");
  });

  it("has proper styling for company name (bold and dark)", () => {
    render(<SidebarHeader />);
    const companyName = screen.getByText("VisionCare");
    expect(companyName).toHaveClass("font-bold");
    expect(companyName).toHaveClass("text-gray-900");
  });

  it("has proper styling for subtitle (muted gray)", () => {
    render(<SidebarHeader />);
    const subtitle = screen.getByText("CRM Dashboard");
    expect(subtitle).toHaveClass("text-gray-500");
  });

  it("has proper border styling", () => {
    const { container } = render(<SidebarHeader />);
    const headerDiv = container.querySelector(".border-b.border-gray-200");
    expect(headerDiv).toBeInTheDocument();
  });

  it("has proper spacing structure", () => {
    const { container } = render(<SidebarHeader />);
    const headerDiv = container.querySelector(".space-y-4");
    expect(headerDiv).toBeInTheDocument();
  });
});
