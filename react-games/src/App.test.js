import { logRoles, render, screen } from "./test-utils/testing-library-utils";
import App from "./App";
import userEvent from "@testing-library/user-event";

test("render app", async () => {
  const user = userEvent.setup();
  render(<App />);

  const languageBtn = screen.getByRole("button", { name: "Language" });
  expect(languageBtn).toBeInTheDocument();

  const appTitle = screen.getByText(/apptitle/);
  expect(appTitle).toBeInTheDocument();

  const loginForm = screen.getByRole("textbox");
  expect(loginForm).toBeInTheDocument();

  const usernameInput = screen.getByPlaceholderText(/username/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const loginBtn = screen.getByRole("button", { name: /log-in/ });
  const registerBtn = screen.getByRole("button", { name: /register/ });
  const errorMsg = await screen.findByText("Required");
  expect(errorMsg).not.toBeInTheDocument();
  expect(loginBtn).toBeInTheDocument();

  await user.click(loginBtn);
  expect(errorMsg).toBeInTheDocument();
});
