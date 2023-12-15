import { screen, render } from "../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import ForgotPassword from "./ForgotPassword";
import { forgotPassword } from "../service";

jest.mock("../service", () => ({
  forgotPassword: jest.fn(),
}));

describe("forgot password", () => {
  const user = userEvent.setup();

  test("doesn't call the function if email isn't submitted", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText(/enteremail/i);
    const submitBtn = screen.getByRole("button");

    expect(emailInput).toBeInTheDocument();
    await user.click(submitBtn);
    expect(forgotPassword).toHaveBeenCalledTimes(0);
  });

  test("submits email to recover password", async () => {
    render(<ForgotPassword />);

    const emailInput = screen.getByPlaceholderText(/enteremail/i);
    await user.type(emailInput, "user@gmail.com");
    const submitBtn = screen.getByRole("button");

    expect(emailInput).toBeInTheDocument();
    await user.click(submitBtn);

    expect(forgotPassword).toHaveBeenCalledWith({ email: "user@gmail.com" });
    expect(forgotPassword).toHaveBeenCalledTimes(1);
  });
});
