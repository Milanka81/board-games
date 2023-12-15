import { screen, render, waitFor } from "../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import ResetPassword from "./ResetPassword";
import { resetPassword } from "../service";
import { useParams } from "react-router-dom";

jest.mock("../service", () => ({
  resetPassword: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("reset password", () => {
  const user = userEvent.setup();
  beforeEach(() => {
    const mockParams = {
      id: 7,
      token: 1234567,
    };

    useParams.mockReturnValue(mockParams);
  });

  test("doesn't call the function if password isn't submitted", async () => {
    render(<ResetPassword />);
    const passwordInput = screen.getByPlaceholderText(/enternewpassword/i);
    const submitBtn = screen.getByRole("button");

    expect(passwordInput).toBeInTheDocument();
    await user.click(submitBtn);
    expect(resetPassword).toHaveBeenCalledTimes(0);
  });

  test("resets password with valid data", async () => {
    render(<ResetPassword />);
    const passwordInput = screen.getByPlaceholderText(/enternewpassword/i);
    await user.type(passwordInput, "newpassword");
    const submitBtn = screen.getByRole("button");

    expect(passwordInput).toBeInTheDocument();
    await user.click(submitBtn);

    expect(resetPassword).toHaveBeenCalledWith(7, 1234567, {
      password: "newpassword",
    });

    await waitFor(() => expect(window.location.pathname).toBe("/"));
  });
});
