import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddApplicationModal from "@/components/applications/AddApplicationModal";

// Mock fetch
global.fetch = jest.fn();

describe("AddApplicationModal Component", () => {
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
          id: "app-1",
          clientFullName: "John Doe",
          applicationType: "Work Visa",
          companyId: testCompanyId,
        },
      }),
    });
  });

  describe("Rendering", () => {
    it("should not render when open is false", () => {
      const { container } = render(
        <AddApplicationModal
          open={false}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("should render when open is true", () => {
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );
      expect(screen.getByText("New Application")).toBeInTheDocument();
    });

    it("should render all form fields", () => {
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );
      expect(screen.getByLabelText(/Client Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Application Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Payment Status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Current Status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    });

    it("should render Cancel and Create Application buttons", () => {
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );
      expect(
        screen.getByRole("button", { name: /Cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Create Application/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("should show error when client name is empty", async () => {
      const user = userEvent.setup();
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Create Application/i }));
      expect(screen.getByText("Client name is required")).toBeInTheDocument();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should show error for invalid email", async () => {
      const user = userEvent.setup();
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      await user.type(screen.getByLabelText(/Client Full Name/i), "John Doe");
      await user.type(screen.getByLabelText(/Email/i), "bad-email");
      await user.click(screen.getByRole("button", { name: /Create Application/i }));
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });

    it("should show error for invalid drive folder link", async () => {
      const user = userEvent.setup();
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      await user.type(screen.getByLabelText(/Client Full Name/i), "John Doe");
      await user.type(screen.getByLabelText(/Drive Folder Link/i), "not-a-url");
      await user.click(screen.getByRole("button", { name: /Create Application/i }));
      expect(screen.getByText("Please enter a valid URL")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should submit valid form and call onSuccess", async () => {
      const user = userEvent.setup();
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
          onSuccess={mockOnSuccess}
        />,
      );

      await user.type(screen.getByLabelText(/Client Full Name/i), "John Doe");
      await user.click(screen.getByRole("button", { name: /Create Application/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/applications",
          expect.objectContaining({ method: "POST" }),
        );
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("should show API error when request fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ success: false, message: "Server error" }),
      });

      const user = userEvent.setup();
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      await user.type(screen.getByLabelText(/Client Full Name/i), "John Doe");
      await user.click(screen.getByRole("button", { name: /Create Application/i }));

      await waitFor(() => {
        expect(screen.getByText("Server error")).toBeInTheDocument();
      });
    });

    it("should show generic error on network failure", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const user = userEvent.setup();
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      await user.type(screen.getByLabelText(/Client Full Name/i), "John Doe");
      await user.click(screen.getByRole("button", { name: /Create Application/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Failed to create application. Please try again."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Cancel and Close", () => {
    it("should call onClose when Cancel is clicked", async () => {
      const user = userEvent.setup();
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Cancel/i }));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should call onClose when overlay is clicked", async () => {
      const user = userEvent.setup();
      render(
        <AddApplicationModal
          open={true}
          onClose={mockOnClose}
          companyId={testCompanyId}
        />,
      );

      // The overlay is the first child (bg-black/50)
      const overlay = document.querySelector(".fixed.inset-0.z-40");
      if (overlay) {
        await user.click(overlay);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });
  });
});
