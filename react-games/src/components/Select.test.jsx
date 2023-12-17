import { render, screen } from "../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Select from "./Select";

// jest.mock("react-flags-select", () => {
//   return () => {
//     return "flag";
//   };
// });
describe("Select Component", () => {
  const user = userEvent.setup();
  test("renders select component with default placeholder", () => {
    render(<Select handleLanguageChange={() => {}} />);

    // Check if the select component renders with a placeholder
    const selectElement = screen.getByRole("button", { name: /language/i });
    expect(selectElement).toBeInTheDocument();
  });

  test("handles language change when selecting a new language", async () => {
    render(<Select handleLanguageChange={() => {}} />);

    const selectElement = screen.getByRole("button", { name: /language/i });
    await user.click(selectElement);

    const englishOption = screen.getByRole("option", {
      name: /english/i,
    });
    const srpskiOption = screen.getByRole("option", {
      name: /srpski/i,
    });
    const russianOption = screen.getByRole("option", {
      name: /русский/i,
    });
    expect(englishOption).toBeInTheDocument();
    expect(srpskiOption).toBeInTheDocument();
    expect(russianOption).toBeInTheDocument();

    await user.click(englishOption);

    const srpskiOption1 = screen.queryByRole("option", {
      name: /srpski/i,
    });
    const russianOption1 = screen.queryByRole("option", {
      name: /русский/i,
    });
    expect(srpskiOption1).not.toBeInTheDocument();
    expect(russianOption1).not.toBeInTheDocument();
  });
});
