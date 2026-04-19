import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditEnquiryModal from "@/components/enquiries/EditEnquiryModal";
import type { Enquiry } from "@/components/enquiries/EnquiryTableNew";

// Mock fetch
global.fetch = jest.fn();

const mockEnquiry: Enquiry = {
  id: "enq-1",
  clientName: "Alice Johnson",
  dateOfBirth: "1990-06-15T12:00:00.000Z",
  email: "alice@example.com",
  phone: "+1-555-0199",
  enquiryType: "study_permit",
  customEnquiryType: "SDS stream",
  notes: "Interested in Fall 2026",
  followUpDate: "2026-05-01T12:00:00.000Z",
  companyId: "company-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("EditEnquiryModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { ...mockEnquiry, clientName: "Updated Name" },
      }),
    });
  });

  describe("Rendering", () => {
    it("should not render when open is false", () => {
      const { container } = render(
        <EditEnquiryModal
          open={false}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("should render when open is true", () => {
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );
      expect(screen.getByText("Edit Enquiry")).toBeInTheDocument();
      expect(
        screen.getByText("Update the enquiry details below"),
      ).toBeInTheDocument();
    });

    it("should pre-fill form with enquiry data", () => {
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );
      expect(screen.getByLabelText(/Client Name/i)).toHaveValue("Alice Johnson");
      expect(screen.getByLabelText(/Email/i)).toHaveValue("alice@example.com");
      expect(screen.getByLabelText(/Phone/i)).toHaveValue("+1-555-0199");
      expect(screen.getByLabelText(/Specific Details/i)).toHaveValue("SDS stream");
      expect(screen.getByLabelText(/Notes/i)).toHaveValue("Interested in Fall 2026");
    });

    it("should render all form fields", () => {
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );
      expect(screen.getByLabelText(/Client Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Enquiry Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Specific Details/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Follow-up Date/i)).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("should show error when client name is cleared", async () => {
      const user = userEvent.setup();
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      const input = screen.getByLabelText(/Client Name/i);
      await user.clear(input);
      await user.click(screen.getByRole("button", { name: /Save Changes/i }));
      expect(screen.getByText("Client name is required")).toBeInTheDocument();
    });

    it("should show error for invalid email", async () => {
      const user = userEvent.setup();
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      const emailInput = screen.getByLabelText(/Email/i);
      await user.clear(emailInput);
      await user.type(emailInput, "not-an-email");
      await user.click(screen.getByRole("button", { name: /Save Changes/i }));
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });

    it("should show error when enquiry type is cleared", async () => {
      const user = userEvent.setup();
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.selectOptions(screen.getByLabelText(/Enquiry Type/i), "");
      await user.click(screen.getByRole("button", { name: /Save Changes/i }));
      expect(screen.getByText("Enquiry type is required")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should submit updated data", async () => {
      const user = userEvent.setup();
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      const nameInput = screen.getByLabelText(/Client Name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Name");
      await user.click(screen.getByRole("button", { name: /Save Changes/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/enquiries/enq-1",
          expect.objectContaining({ method: "PUT" }),
        );
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it("should show API error on failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ success: false, message: "Update failed" }),
      });

      const user = userEvent.setup();
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Save Changes/i }));

      await waitFor(() => {
        expect(screen.getByText("Update failed")).toBeInTheDocument();
      });
    });

    it("should show generic error on network failure", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const user = userEvent.setup();
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Save Changes/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Failed to update enquiry. Please try again."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Cancel and Close", () => {
    it("should call onClose when Cancel is clicked", async () => {
      const user = userEvent.setup();
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Cancel/i }));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should call onClose when overlay is clicked", async () => {
      const user = userEvent.setup();
      render(
        <EditEnquiryModal
          open={true}
          enquiry={mockEnquiry}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      const overlay = document.querySelector(".fixed.inset-0.z-40");
      if (overlay) {
        await user.click(overlay);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });
  });
});
