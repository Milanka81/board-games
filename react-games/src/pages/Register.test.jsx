import { screen, render, waitFor } from "../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Register from "./Register";
import { register } from "../service";
jest.mock("../service", () => ({
  register: jest.fn(),
}));

describe("renders register page", () => {
  const user = userEvent.setup();
  const placeholders = {
    firstname: /firstname/i,
    lastname: /lastname/i,
    username: /username/i,
    password: /password/i,
    email: /email/i,
  };
  test("renders form corectly", () => {
    render(<Register />);

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    const heading = screen.getByRole("heading", { name: /register/i });
    expect(heading).toBeInTheDocument();
    const inputs = [];
    for (let key in placeholders) {
      const value = placeholders[key];
      const input = screen.getByPlaceholderText(value);
      inputs.push(input);
      expect(input).toBeInTheDocument();
    }
    expect(inputs).toHaveLength(5);
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    expect(submitBtn).toBeInTheDocument();
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });

    expect(submitBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
  });

  test("form doesn't submit when inputs are empty but shows errors", async () => {
    render(<Register />);
    const submitBtn = screen.getByRole("button", { name: /submit/i });

    await user.click(submitBtn);
    await waitFor(async () => {
      const errorMsg = await screen.findAllByText(/required/);
      expect(errorMsg).toHaveLength(5);
    });
    expect(register).not.toHaveBeenCalled();
  });

  test("form doesn't submit when NOT all inputs filled", async () => {
    render(<Register />);
    const firstname = screen.getByPlaceholderText(placeholders.firstname);
    const lastname = screen.getByPlaceholderText(placeholders.lastname);
    const username = screen.getByPlaceholderText(placeholders.username);
    const password = screen.getByPlaceholderText(placeholders.password);

    await user.type(firstname, "john");
    await user.type(lastname, "smith");
    await user.type(username, "john123");
    await user.type(password, "pass");

    expect(username).toHaveValue("john123");
    const submitBtn = screen.getByRole("button", { name: /submit/i });

    await user.click(submitBtn);
    await waitFor(async () => {
      const errorMsg = await screen.findByText(/required/);
      expect(errorMsg).toBeInTheDocument();
    });
    expect(register).not.toHaveBeenCalled();
  });
  test("submits form with all inputs filled", async () => {
    render(<Register />);
    const firstname = screen.getByPlaceholderText(placeholders.firstname);
    const lastname = screen.getByPlaceholderText(placeholders.lastname);
    const username = screen.getByPlaceholderText(placeholders.username);
    const password = screen.getByPlaceholderText(placeholders.password);
    const email = screen.getByPlaceholderText(placeholders.email);
    await user.type(firstname, "john");
    await user.type(lastname, "smith");
    await user.type(username, "john123");
    await user.type(password, "pass");
    await user.type(email, "johnsmith@gmail.com");
    const submitBtn = screen.getByRole("button", { name: /submit/i });

    await user.click(submitBtn);
    expect(register).toHaveBeenCalled();
    expect(register).toHaveBeenCalledWith({
      firstName: "john",
      lastName: "smith",
      username: "john123",
      password: "pass",
      email: "johnsmith@gmail.com",
    });
  });
  test("returns to login page when cancel button is clicked", async () => {
    render(<Register />);
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    expect(cancelBtn).toBeInTheDocument();
    await user.click(cancelBtn);
    await waitFor(() => expect(window.location.pathname).toBe("/login"));
  });
});
