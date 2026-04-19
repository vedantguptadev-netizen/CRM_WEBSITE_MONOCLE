import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditApplicationModal from "@/components/applications/EditApplicationModal";
import type { Application } from "@/components/applications/ApplicationTableNew";

// Mock fetch
global.fetch = jest.fn();

const mockApplication: Application = {
  id: "app-1",
  clientFullName: "John Doe",
  applicationType: "Work Visa",
  email: "john@example.com",
  phone: "+1-555-0101",
  notes: "Test notes",
  paymentStatus: "PENDING",
  currentStatus: "IN_PROCESS",
  dueDate: "2026-06-01T12:00:00.000Z",
  assignedEmployeeId: null,
  driveFolderLink: "https://drive.google.com/folder/abc",
  companyId: "company-1",
  enquiryId: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("EditApplicationModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { ...mockApplication, clientFullName: "Updated Name" },
      }),
    });
  });

  describe("Rendering", () => {
    it("should not render when open is false", () => {
      const { container } = render(
        <EditApplicationModal
          open={false}
          application={mockApplication}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("should render when open is true", () => {
      render(
        <EditApplicationModal
          open={true}
          application={mockApplication}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );
      expect(screen.getByText("Edit Application")).toBeInTheDocument();
    });

    it("should pre-fill form with application data", () => {
      render(
        <EditApplicationModal
          open={true}
          application={mockApplication}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );
      expect(screen.getByLabelText(/Client Full Name/i)).toHaveValue("John Doe");
      expect(screen.getByLabelText(/Email/i)).toHaveValue("john@example.com");
      expect(screen.getByLabelText(/Phone/i)).toHaveValue("+1-555-0101");
      expect(screen.getByLabelText(/Application Type/i)).toHaveValue("Work Visa");
    });
  });

  describe("Validation", () => {
    it("should show error when client name is cleared", async () => {
      const user = userEvent.setup();
      render(
        <EditApplicationModal
          open={true}
          application={mockApplication}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      const input = screen.getByLabelText(/Client Full Name/i);
      await user.clear(input);
      await user.click(screen.getByRole("button", { name: /Save Changes/i }));
      expect(screen.getByText("Client name is required")).toBeInTheDocument();
    });

    it("should show error for invalid email", async () => {
      const user = userEvent.setup();
      render(
        <EditApplicationModal
          open={true}
          application={mockApplication}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      const emailInput = screen.getByLabelText(/Email/i);
      await user.clear(emailInput);
      await user.type(emailInput, "bad-email");
      await user.click(screen.getByRole("button", { name: /Save Changes/i }));
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should submit updated data", async () => {
      const user = userEvent.setup();
      render(
        <EditApplicationModal
          open={true}
          application={mockApplication}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      const nameInput = screen.getByLabelText(/Client Full Name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Name");
      await user.click(screen.getByRole("button", { name: /Save Changes/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/applications/app-1",
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
        <EditApplicationModal
          open={true}
          application={mockApplication}
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
        <EditApplicationModal
          open={true}
          application={mockApplication}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Save Changes/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Failed to update application. Please try again."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Cancel and Close", () => {
    it("should call onClose when Cancel is clicked", async () => {
      const user = userEvent.setup();
      render(
        <EditApplicationModal
          open={true}
          application={mockApplication}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Cancel/i }));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
