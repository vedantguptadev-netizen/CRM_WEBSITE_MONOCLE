import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EnquiryTable, {
  EmptyState,
} from "@/components/enquiries/EnquiryTableNew";
import type { Enquiry } from "@/components/enquiries/EnquiryTableNew";

// ─── Fixtures ───────────────────────────────────────────────────

const mockEnquiries: Enquiry[] = [
  {
    id: "1",
    clientName: "John Doe",
    dateOfBirth: "1995-01-25T00:00:00Z",
    email: "john@example.com",
    phone: "+1234567890",
    enquiryType: "visa",
    notes: "Follow up regarding visa application status",
    followUpDate: "2026-03-15T00:00:00Z",
    createdAt: "2026-03-09T10:00:00Z",
    updatedAt: "2026-03-09T10:00:00Z",
    companyId: "company-1",
    application: { id: "app-1" },
  },
  {
    id: "2",
    clientName: "Jane Smith",
    dateOfBirth: null,
    email: null,
    phone: null,
    enquiryType: "consultation",
    notes: null,
    followUpDate: null,
    createdAt: "2026-03-08T14:30:00Z",
    updatedAt: "2026-03-08T14:30:00Z",
    companyId: "company-1",
    application: null,
  },
  {
    id: "3",
    clientName: "Bob Johnson",
    dateOfBirth: "1988-07-14T00:00:00Z",
    email: "bob@example.com",
    phone: "+9876543210",
    enquiryType: "documentation",
    notes: "Pending document submission",
    followUpDate: "2026-03-20T00:00:00Z",
    createdAt: "2026-03-07T08:00:00Z",
    updatedAt: "2026-03-07T08:00:00Z",
    companyId: "company-1",
    application: null,
  },
];

const defaultHandlers = {
  onView: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onCreateApplication: jest.fn(),
  onViewApplication: jest.fn(),
};

function renderTable(props?: Partial<Parameters<typeof EnquiryTable>[0]>) {
  return render(
    <EnquiryTable enquiries={mockEnquiries} {...defaultHandlers} {...props} />,
  );
}

// ─── Tests ──────────────────────────────────────────────────────

describe("EnquiryTable Component", () => {
  beforeEach(() => jest.clearAllMocks());

  // ── Rendering ─────────────────────────────────────────────

  it("should render table with correct headers", () => {
    renderTable();

    expect(screen.getByText("Client Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Date of Birth")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Application")).toBeInTheDocument();
    expect(screen.getByText("Follow-Up")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("should render all enquiry rows", () => {
    renderTable();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });

  it("should render client names with font-medium class", () => {
    const { container } = renderTable();
    // First td in each row is the client name column
    const rows = container.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const firstCell = row.querySelector("td:first-child span");
      expect(firstCell).toHaveClass("font-medium");
    });
  });

  // ── Email / Phone display ─────────────────────────────────

  it("should show email when present", () => {
    renderTable();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("should show dash when email is null", () => {
    renderTable();
    const row = screen.getByText("Jane Smith").closest("tr")!;
    const cells = within(row).getAllByRole("cell");
    // Email is the 2nd column (index 1)
    expect(cells[1].textContent).toBe("\u2014");
  });

  it("should show phone when present", () => {
    renderTable();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();
  });

  it("should show dash when phone is null", () => {
    renderTable();
    const row = screen.getByText("Jane Smith").closest("tr")!;
    const cells = within(row).getAllByRole("cell");
    // Phone is the 3rd column (index 2)
    expect(cells[2].textContent).toBe("\u2014");
  });

  // ── Type badges ───────────────────────────────────────────

  it("should display human-readable type labels", () => {
    renderTable();
    expect(screen.getByText("Visa Application")).toBeInTheDocument();
    expect(screen.getByText("Consultation")).toBeInTheDocument();
    expect(screen.getByText("Documentation")).toBeInTheDocument();
  });

  it("should apply coloured badge to enquiry type", () => {
    renderTable();
    const visaBadge = screen.getByText("Visa Application");
    expect(visaBadge.className).toContain("ring-1");
    expect(visaBadge.className).toContain("ring-inset");
  });

  // ── Application linked status ─────────────────────────────

  it("should show 'Linked' badge when enquiry has application", () => {
    renderTable();
    expect(screen.getByText("Linked")).toBeInTheDocument();
  });

  it("should show 'Not linked' badge when enquiry has no application", () => {
    renderTable();
    const notLinkedBadges = screen.getAllByText("Not linked");
    expect(notLinkedBadges.length).toBe(2); // Jane and Bob
  });

  // ── Date formatting ───────────────────────────────────────

  it("should format dates in readable format", () => {
    renderTable();
    const tableText = screen.getByRole("table").textContent || "";
    expect(tableText).toContain("2026");
    expect(tableText).toMatch(/Mar/);
  });

  it("should show dash when followUpDate is null", () => {
    renderTable();
    const row = screen.getByText("Jane Smith").closest("tr")!;
    const cells = within(row).getAllByRole("cell");
    // DOB is the 4th column (index 3)
    expect(cells[3].textContent).toBe("\u2014");
    // Follow-Up is the 7th column (index 6)
    expect(cells[6].textContent).toBe("\u2014");
  });

  // ── Empty state ───────────────────────────────────────────

  it("should show empty state when no enquiries", () => {
    renderTable({ enquiries: [] });
    expect(screen.getByText("No enquiries yet")).toBeInTheDocument();
    expect(
      screen.getByText("Get started by creating a new enquiry."),
    ).toBeInTheDocument();
  });

  // ── Loading skeleton ──────────────────────────────────────

  it("should show loading skeleton when isLoading is true", () => {
    const { container } = renderTable({ isLoading: true, enquiries: [] });
    const pulsingElements = container.querySelectorAll(".animate-pulse");
    expect(pulsingElements.length).toBeGreaterThan(0);
  });

  // ── Row click → onView ────────────────────────────────────

  it("should call onView when a row is clicked", async () => {
    const user = userEvent.setup();
    renderTable();

    const row = screen.getByText("John Doe").closest("tr")!;
    await user.click(row);

    expect(defaultHandlers.onView).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", clientName: "John Doe" }),
    );
  });

  // ── Action menu ───────────────────────────────────────────

  it("should render action button for each row", () => {
    renderTable();
    const actionButtons = screen.getAllByLabelText("Row actions");
    expect(actionButtons.length).toBe(3);
  });

  it("should open dropdown when action button is clicked", async () => {
    const user = userEvent.setup();
    renderTable();

    const actionButton = screen.getAllByLabelText("Row actions")[0];
    await user.click(actionButton);

    expect(screen.getByText("View Details")).toBeInTheDocument();
    expect(screen.getByText("Edit Enquiry")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("should show View Application for enquiry with linked app", async () => {
    const user = userEvent.setup();
    renderTable();

    // First enquiry has application
    const actionButton = screen.getAllByLabelText("Row actions")[0];
    await user.click(actionButton);

    expect(screen.getByText("View Application")).toBeInTheDocument();
  });

  it("should show Create Application for enquiry without linked app", async () => {
    const user = userEvent.setup();
    renderTable();

    // Second enquiry has no application
    const actionButton = screen.getAllByLabelText("Row actions")[1];
    await user.click(actionButton);

    expect(screen.getByText("Create Application")).toBeInTheDocument();
  });

  it("should call onEdit when Edit Enquiry is clicked", async () => {
    const user = userEvent.setup();
    renderTable();

    const actionButton = screen.getAllByLabelText("Row actions")[0];
    await user.click(actionButton);

    await user.click(screen.getByText("Edit Enquiry"));

    expect(defaultHandlers.onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1" }),
    );
  });

  it("should call onDelete when Delete is clicked", async () => {
    const user = userEvent.setup();
    renderTable();

    const actionButton = screen.getAllByLabelText("Row actions")[1];
    await user.click(actionButton);

    await user.click(screen.getByText("Delete"));

    expect(defaultHandlers.onDelete).toHaveBeenCalledWith("2");
  });

  it("should call onViewApplication for linked enquiry", async () => {
    const user = userEvent.setup();
    renderTable();

    const actionButton = screen.getAllByLabelText("Row actions")[0];
    await user.click(actionButton);

    await user.click(screen.getByText("View Application"));

    expect(defaultHandlers.onViewApplication).toHaveBeenCalledWith("app-1");
  });

  it("should call onCreateApplication for unlinked enquiry", async () => {
    const user = userEvent.setup();
    renderTable();

    const actionButton = screen.getAllByLabelText("Row actions")[1];
    await user.click(actionButton);

    await user.click(screen.getByText("Create Application"));

    expect(defaultHandlers.onCreateApplication).toHaveBeenCalledWith("2");
  });

  it("should close dropdown after selecting an action", async () => {
    const user = userEvent.setup();
    renderTable();

    const actionButton = screen.getAllByLabelText("Row actions")[0];
    await user.click(actionButton);

    expect(screen.getByText("Edit Enquiry")).toBeInTheDocument();

    await user.click(screen.getByText("Edit Enquiry"));

    expect(screen.queryByText("Edit Enquiry")).not.toBeInTheDocument();
  });

  // ── Styling ───────────────────────────────────────────────

  it("should have hover effect on rows", () => {
    const { container } = renderTable();
    const rows = container.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      expect(row.className).toContain("hover:bg-gray-50");
    });
  });

  it("should have cursor-pointer on rows", () => {
    const { container } = renderTable();
    const rows = container.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      expect(row.className).toContain("cursor-pointer");
    });
  });

  it("should have proper border styling", () => {
    const { container } = renderTable();
    const wrapper = container.querySelector(".border.border-gray-200");
    expect(wrapper).toBeInTheDocument();
  });

  // ── Edge cases ────────────────────────────────────────────

  it("should handle single enquiry", () => {
    renderTable({
      enquiries: [
        {
          id: "1",
          clientName: "Solo User",
          email: null,
          phone: null,
          enquiryType: "general",
          notes: null,
          followUpDate: null,
          createdAt: "2026-03-09T10:00:00Z",
          updatedAt: "2026-03-09T10:00:00Z",
          companyId: "company-1",
          application: null,
        },
      ],
    });

    expect(screen.getByText("Solo User")).toBeInTheDocument();
    expect(screen.getByText("General Enquiry")).toBeInTheDocument();
  });

  it("should handle special characters in client names", () => {
    renderTable({
      enquiries: [
        {
          id: "1",
          clientName: "José García-López",
          email: "jose@example.com",
          phone: null,
          enquiryType: "visa",
          notes: null,
          followUpDate: null,
          createdAt: "2026-03-09T10:00:00Z",
          updatedAt: "2026-03-09T10:00:00Z",
          companyId: "company-1",
          application: null,
        },
      ],
    });

    expect(screen.getByText("José García-López")).toBeInTheDocument();
  });
});

// ─── EmptyState sub-component ───────────────────────────────────

describe("EmptyState Component", () => {
  it("should show default empty message when not filtered", () => {
    render(<EmptyState isFiltered={false} />);
    expect(screen.getByText("No enquiries yet")).toBeInTheDocument();
    expect(
      screen.getByText("Get started by creating a new enquiry."),
    ).toBeInTheDocument();
  });

  it("should show filtered empty message when filtered", () => {
    render(<EmptyState isFiltered={true} />);
    expect(screen.getByText("No matching enquiries")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Try adjusting your search or filters to find what you're looking for.",
      ),
    ).toBeInTheDocument();
  });

  it("should show clear filters button when filtered with callback", async () => {
    const user = userEvent.setup();
    const onClearFilters = jest.fn();
    render(<EmptyState isFiltered={true} onClearFilters={onClearFilters} />);

    const clearButton = screen.getByText("Clear all filters");
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(onClearFilters).toHaveBeenCalled();
  });

  it("should not show clear filters button when not filtered", () => {
    render(<EmptyState isFiltered={false} />);
    expect(screen.queryByText("Clear all filters")).not.toBeInTheDocument();
  });
});
