import { screen, render } from "../test-utils/testing-library-utils";
import SearchBar from "./SearchBar";
import userEvent from "@testing-library/user-event";

test("renders search bar component", async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();
  render(
    <SearchBar
      handleChange={handleChange}
      placeholder="search..."
      className="search"
    />
  );
  const bar = screen.getByRole("textbox");
  expect(bar).toBeInTheDocument();
  bar.focus();
  await user.type(bar, "monopoly");
  expect(bar).toHaveValue("monopoly");
  expect(handleChange).toHaveBeenCalledTimes(8);
});
