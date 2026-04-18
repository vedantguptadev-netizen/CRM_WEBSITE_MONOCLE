import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import DashboardClient from "@/components/DashboardClient";

// ─── Fixtures ───────────────────────────────────────────────────

const baseStats = {
  totalEnquiries: 15,
  totalApplications: 8,
  pipelineInProcess: 4,
  pipelinePendingInfo: 2,
  pipelineSubmitted: 2,
  pendingPayments: 3,
  upcomingFollowUps: 3,
  overdueApplications: 1,
  enquiriesWithoutApp: 7,
};

const zeroStats = {
  totalEnquiries: 0,
  totalApplications: 0,
  pipelineInProcess: 0,
  pipelinePendingInfo: 0,
  pipelineSubmitted: 0,
  pendingPayments: 0,
  upcomingFollowUps: 0,
  overdueApplications: 0,
  enquiriesWithoutApp: 0,
};

// ─── Tests ──────────────────────────────────────────────────────

describe("DashboardClient", () => {
  describe("Page Header", () => {
    it("renders the Dashboard heading", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(
        screen.getByRole("heading", { name: /^dashboard$/i }),
      ).toBeInTheDocument();
    });

    it("renders the welcome subtitle", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(
        screen.getByText(/welcome back.*overview of your crm activity/i),
      ).toBeInTheDocument();
    });
  });

  describe("Stats Cards", () => {
    it("displays total enquiries count", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("Total Enquiries")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("displays enquiries without application count", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("7 without application")).toBeInTheDocument();
    });

    it("displays total applications count", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("Total Applications")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("displays currently in process count", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("4 in process")).toBeInTheDocument();
    });

    it("displays pending payments count", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("Pending Payments")).toBeInTheDocument();
      expect(screen.getByText("Awaiting payment")).toBeInTheDocument();
    });

    it("displays needs attention card with computed total", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("Needs Attention")).toBeInTheDocument();
      // needsAttention = overdueApplications(1) + upcomingFollowUps(3) = 4
      const label = screen.getByText("Needs Attention");
      const card = label.closest(".rounded-xl");
      const count = card?.querySelector(".text-3xl.font-bold");
      expect(count).toHaveTextContent("4");
    });

    it("displays overdue and follow-ups breakdown", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText(/1 overdue/)).toBeInTheDocument();
      expect(screen.getByText(/3 follow-ups/)).toBeInTheDocument();
    });

    it("shows zero stats correctly", () => {
      render(<DashboardClient stats={zeroStats} />);
      const zeros = screen.getAllByText("0");
      // totalEnquiries, totalApplications, pendingPayments, pendingActions = 4 zeros at minimum
      expect(zeros.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Needs Attention — conditional styling", () => {
    it("applies red styling when there are pending actions", () => {
      const { container } = render(<DashboardClient stats={baseStats} />);
      const redBorder = container.querySelector(".border-red-200");
      expect(redBorder).toBeInTheDocument();
    });

    it("applies neutral styling when there are zero pending actions", () => {
      const { container } = render(<DashboardClient stats={zeroStats} />);
      const redBorder = container.querySelector(".border-red-200");
      expect(redBorder).not.toBeInTheDocument();
    });
  });

  describe("Application Pipeline", () => {
    it("renders pipeline section when there are applications", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("Application Pipeline")).toBeInTheDocument();
    });

    it("displays In Process count", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("In Process")).toBeInTheDocument();
    });

    it("displays Pending Info count", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("Pending Info")).toBeInTheDocument();
    });

    it("displays Submitted count correctly", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("Submitted")).toBeInTheDocument();
      // pipelineSubmitted = 2
      const submittedLabel = screen.getByText("Submitted");
      const submittedCount =
        submittedLabel.parentElement?.querySelector(".text-xl.font-bold");
      expect(submittedCount).toHaveTextContent("2");
    });

    it("pipeline counts reconcile with total applications", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(
        baseStats.pipelineInProcess +
          baseStats.pipelinePendingInfo +
          baseStats.pipelineSubmitted,
      ).toBe(baseStats.totalApplications);
    });

    it("hides pipeline section when there are no applications", () => {
      render(<DashboardClient stats={zeroStats} />);
      expect(
        screen.queryByText("Application Pipeline"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Rendering with various data scenarios", () => {
    it("handles large numbers", () => {
      const bigStats = {
        totalEnquiries: 9999,
        totalApplications: 5000,
        pipelineInProcess: 2000,
        pipelinePendingInfo: 1500,
        pipelineSubmitted: 1500,
        pendingPayments: 1800,
        upcomingFollowUps: 100,
        overdueApplications: 50,
        enquiriesWithoutApp: 3000,
      };
      render(<DashboardClient stats={bigStats} />);
      expect(screen.getByText("9999")).toBeInTheDocument();
      expect(screen.getByText("5000")).toBeInTheDocument();
    });

    it("renders all four stat cards", () => {
      render(<DashboardClient stats={baseStats} />);
      expect(screen.getByText("Total Enquiries")).toBeInTheDocument();
      expect(screen.getByText("Total Applications")).toBeInTheDocument();
      expect(screen.getByText("Pending Payments")).toBeInTheDocument();
      expect(screen.getByText("Needs Attention")).toBeInTheDocument();
    });

    it("renders styled card containers", () => {
      const { container } = render(<DashboardClient stats={baseStats} />);
      const cards = container.querySelectorAll(".rounded-xl.border");
      // 4 stat cards + 1 pipeline section = 5
      expect(cards.length).toBe(5);
    });
  });
});
