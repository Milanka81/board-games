import { screen, render } from "../test-utils/testing-library-utils";
import Header from "./Header";
import "@testing-library/jest-dom";

test("render header", async () => {
  render(<Header />);

  const languageBtn = screen.getByRole("button", { name: "Language" });
  expect(languageBtn).toBeInTheDocument();

  const appTitle = screen.getByText(/apptitle/);
  expect(appTitle).toBeInTheDocument();
});
