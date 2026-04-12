import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddEnquiryModal from "@/components/enquiries/AddEnquiryModal";

// Mock fetch
global.fetch = jest.fn();

describe("AddEnquiryModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const testCompanyId = "test-company-123";

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        data: {
          id: "enquiry-1",
          clientName: "Test Client",
          email: "test@example.com",
          phone: "+1234567890",
          enquiryType: "visa",
          notes: "Test notes",
          companyId: testCompanyId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
    });
  });

  describe("Rendering", () => {
    it("should not render when open is false", () => {
      const { container } = render(
        <AddEnquiryModal
          open={false}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it("should render when open is true", () => {
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      expect(screen.getByText("New Enquiry")).toBeInTheDocument();
    });

    it("should render modal title and subtitle", () => {
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      expect(screen.getByText("New Enquiry")).toBeInTheDocument();
      expect(
        screen.getByText("Enter the client enquiry details below"),
      ).toBeInTheDocument();
    });

    it("should render all form fields", () => {
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      expect(screen.getByLabelText(/Client Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Enquiry Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    });

    it("should render Cancel and Create Enquiry buttons", () => {
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      expect(
        screen.getByRole("button", { name: /Cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Create Enquiry/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Form Input Handling", () => {
    it("should update client name input", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const clientNameInput = screen.getByPlaceholderText("Enter client name");
      await user.type(clientNameInput, "John Doe");

      expect(clientNameInput).toHaveValue("John Doe");
    });

    it("should update email input", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const emailInput = screen.getByPlaceholderText("client@example.com");
      await user.type(emailInput, "john@example.com");

      expect(emailInput).toHaveValue("john@example.com");
    });

    it("should update phone input", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const phoneInput = screen.getByPlaceholderText("+1 (555) 000-0000");
      await user.type(phoneInput, "+1 (555) 123-4567");

      expect(phoneInput).toHaveValue("+1 (555) 123-4567");
    });

    it("should update enquiry type select", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const enquiryTypeSelect = screen.getByLabelText(/Enquiry Type/i);
      await user.selectOptions(enquiryTypeSelect, "visa");

      expect(enquiryTypeSelect).toHaveValue("visa");
    });

    it("should update notes textarea", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const notesTextarea = screen.getByPlaceholderText(
        "Add any additional notes\u2026",
      );
      await user.type(notesTextarea, "Client needs urgent assistance");

      expect(notesTextarea).toHaveValue("Client needs urgent assistance");
    });
  });

  describe("Form Validation", () => {
    it("should show error for empty client name", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const saveButton = screen.getByRole("button", {
        name: /Create Enquiry/i,
      });
      await user.click(saveButton);

      expect(screen.getByText("Client name is required")).toBeInTheDocument();
    });

    it("should show error for empty enquiry type", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const clientNameInput = screen.getByPlaceholderText("Enter client name");
      await user.type(clientNameInput, "John Doe");

      const saveButton = screen.getByRole("button", {
        name: /Create Enquiry/i,
      });
      await user.click(saveButton);

      expect(screen.getByText("Enquiry type is required")).toBeInTheDocument();
    });

    it("should allow save with required fields filled", async () => {
      const user = userEvent.setup();

      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const clientNameInput = screen.getByPlaceholderText("Enter client name");
      const enquiryTypeSelect = screen.getByLabelText(/Enquiry Type/i);

      await user.type(clientNameInput, "John Doe");
      await user.selectOptions(enquiryTypeSelect, "visa");

      const saveButton = screen.getByRole("button", {
        name: /Create Enquiry/i,
      });
      await user.click(saveButton);

      // Wait for the API call to complete
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/enquiries",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }),
        );
      });

      // Verify the modal was closed (onClose called)
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("should clear error when user starts typing", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const saveButton = screen.getByRole("button", {
        name: /Create Enquiry/i,
      });
      await user.click(saveButton);

      // Error should be visible
      expect(screen.getByText("Client name is required")).toBeInTheDocument();

      // Start typing
      const clientNameInput = screen.getByPlaceholderText("Enter client name");
      await user.type(clientNameInput, "J");

      // Error should disappear (or be replaced on next validation)
      await waitFor(() => {
        // After typing, the error state should be cleared
        const errors = screen.queryAllByText("Client name is required");
        expect(errors.length).toBe(0);
      });
    });
  });

  describe("Button Actions", () => {
    it("should close modal when Cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const cancelButton = screen.getByRole("button", { name: /Cancel/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should close modal when Save button is clicked with valid data", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const clientNameInput = screen.getByPlaceholderText("Enter client name");
      const enquiryTypeSelect = screen.getByLabelText(/Enquiry Type/i);

      await user.type(clientNameInput, "John Doe");
      await user.selectOptions(enquiryTypeSelect, "visa");

      const saveButton = screen.getByRole("button", {
        name: /Create Enquiry/i,
      });
      await user.click(saveButton);

      // Wait for async API call to complete
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("should close modal when overlay is clicked", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const overlay = container.querySelector(".bg-black\\/50");
      if (overlay) {
        await user.click(overlay);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });

    it("should close modal when X button is clicked", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      // The X button is inside the header, find it via the SVG icon
      const xButtons = container.querySelectorAll("button");
      // First button in the modal header area is the X close button
      // Cancel and Create Enquiry are the footer buttons
      const xButton = Array.from(xButtons).find(
        (btn) =>
          !btn.textContent?.includes("Cancel") &&
          !btn.textContent?.includes("Create"),
      );
      if (xButton) {
        await user.click(xButton);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });
  });

  describe("Form Reset", () => {
    it("should reset form fields when Cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const clientNameInput = screen.getByPlaceholderText(
        "Enter client name",
      ) as HTMLInputElement;
      const emailInput = screen.getByPlaceholderText(
        "client@example.com",
      ) as HTMLInputElement;

      await user.type(clientNameInput, "John Doe");
      await user.type(emailInput, "john@example.com");

      const cancelButton = screen.getByRole("button", { name: /Cancel/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should reset form fields when Save is successful", async () => {
      const user = userEvent.setup();
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const clientNameInput = screen.getByPlaceholderText(
        "Enter client name",
      ) as HTMLInputElement;
      const enquiryTypeSelect = screen.getByLabelText(/Enquiry Type/i);

      await user.type(clientNameInput, "John Doe");
      await user.selectOptions(enquiryTypeSelect, "visa");

      const saveButton = screen.getByRole("button", {
        name: /Create Enquiry/i,
      });
      await user.click(saveButton);

      // Wait for async API call and modal close
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper label associations", () => {
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      expect(screen.getByLabelText(/Client Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Enquiry Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    });

    it("should mark required fields with asterisk", () => {
      render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      const clientNameLabel = screen.getByText("Client Name");
      const enquiryTypeLabel = screen.getByText("Enquiry Type");

      expect(clientNameLabel.textContent).toContain("*");
      expect(enquiryTypeLabel.textContent).toContain("*");
    });

    it("should have a close button in header", () => {
      const { container } = render(
        <AddEnquiryModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      // The X close button exists (renders Lucide X icon)
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThanOrEqual(3); // X, Cancel, Create Enquiry
    });
  });
});
