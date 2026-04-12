import { render, screen, fireEvent, waitFor } from "@/__tests__/test-utils";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/crm/login/page.tsx";

// Mock window.location.href
delete (window as any).location;
(window as any).location = { href: "" };

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (window as any).location.href = "";
  });

  // Rendering Tests
  it("should render login form with email and password inputs", () => {
    render(<LoginPage />);

    expect(screen.getByText("Monocle Immigration CRM")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("should render input placeholders", () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText("you@company.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("should not show error message initially", () => {
    render(<LoginPage />);

    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
  });

  // Input Tests
  it("should update email input value", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(
      "Email Address",
    ) as HTMLInputElement;
    await user.type(emailInput, "test@example.com");

    expect(emailInput.value).toBe("test@example.com");
  });

  it("should update password input value", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    await user.type(passwordInput, "password123");

    expect(passwordInput.value).toBe("password123");
  });

  // Form Submission Tests
  it("should show loading state while submitting", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                json: async () => ({ success: true, companyId: "company-1" }),
              }),
            100,
          ),
        ),
    );

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(
      screen.getByRole("button", { name: /signing in/i }),
    ).toBeInTheDocument();
  });

  // Success Tests
  it("should redirect to dashboard on successful login", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        companyId: "company-123",
        userId: "user-456",
      }),
    });

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect((window as any).location.href).toBe("/crm/dashboard");
    });
  });

  it("should send correct API request with email and password", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, companyId: "company-123" }),
    });

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
    });
  });

  // Error Tests
  it("should show error message on invalid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: false, message: "Invalid credentials" }),
    });

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("should show generic error message on network failure", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("An error occurred. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("should not redirect on failed login", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: false, message: "Invalid credentials" }),
    });

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect((window as any).location.href).not.toBe("/crm/dashboard");
    });
  });

  // Button State Tests
  it("should disable button while submitting", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                json: async () => ({ success: true, companyId: "company-1" }),
              }),
            200,
          ),
        ),
    );

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: /sign in/i,
    }) as HTMLButtonElement;

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(submitButton.disabled).toBe(true);
  });

  it("should enable button after submission completes", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: false, message: "Invalid credentials" }),
    });

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: /sign in/i,
    }) as HTMLButtonElement;

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });
  });

  // Clear Error Tests
  it("should clear previous error on new submission", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    // First submission fails
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: false, message: "Invalid credentials" }),
    });

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    // Second submission succeeds
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, companyId: "company-123" }),
    });

    await user.clear(passwordInput);
    await user.type(passwordInput, "correctpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect((window as any).location.href).toBe("/crm/dashboard");
    });
  });
});
