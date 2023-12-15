import { render, screen, waitFor } from "../test-utils/testing-library-utils";
import Login from "./Login";
import userEvent from "@testing-library/user-event";
import { login } from "../service";

jest.mock("../service", () => ({
  login: jest.fn(),
}));

describe("renders login component", () => {
  const user = userEvent.setup();
  test("shows error massages on empty form submition", async () => {
    render(<Login />);
    const loginForm = screen.getByRole("textbox");
    expect(loginForm).toBeInTheDocument();

    const loginBtn = screen.getByRole("button", { name: /log-in/ });
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const registerBtn = screen.getByRole("button", { name: /register/ });

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginBtn).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();
    await user.click(loginBtn);
    await waitFor(async () => {
      const errorMsg = await screen.findAllByText(/required/);
      expect(errorMsg).toHaveLength(2);
    });
  });

  test("submits the form with valid data", async () => {
    render(<Login />);
    const loginBtn = screen.getByRole("button", { name: /log-in/ });
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(usernameInput, "user");
    await user.type(passwordInput, "user");
    expect(usernameInput).toHaveValue("user");
    expect(passwordInput).toHaveValue("user");

    await user.click(loginBtn);
    expect(login).toHaveBeenCalledWith({ username: "user", password: "user" });
    await waitFor(() => expect(window.location.pathname).toBe("/"));
  });

  test("clicking button redirects to register page", async () => {
    render(<Login />);
    const registerBtn = screen.getByRole("button", { name: /register/ });
    await user.click(registerBtn);
    await waitFor(() => expect(window.location.pathname).toBe("/register"));
  });

  test("clicking button redirects to forgot password page", async () => {
    render(<Login />);

    const passwordBtn = screen.getByRole("button", {
      name: /forgotpassword?/i,
    });
    expect(passwordBtn).toBeInTheDocument();
    await user.click(passwordBtn);

    await waitFor(() =>
      expect(window.location.pathname).toBe("/forgot-password")
    );
  });
});
