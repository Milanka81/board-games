import userEvent from "@testing-library/user-event";
import { screen, render } from "../test-utils/testing-library-utils";
import Pagination from "./Pagination";

describe("renders pagination component", () => {
  const user = userEvent.setup();
  test("renders pagination buttons correctly", () => {
    render(<Pagination currentPage={1} setCurrentPage={() => {}} count={5} />);

    const activeClass = "pagination__btnPage-active";

    const activePage = screen.getByText("1");
    expect(activePage).toBeInTheDocument();
    const nonActivePage = screen.getByText("2");
    expect(nonActivePage).toBeInTheDocument();
    expect(activePage.classList).toContain(activeClass);
    expect(nonActivePage.classList).not.toContain(activeClass);

    const previous = screen.getByRole("button", { name: /previous/i });
    const next = screen.getByRole("button", { name: /next/i });
    expect(previous).toBeInTheDocument();
    expect(next).toBeInTheDocument();
  });

  test("handles click events correctly", async () => {
    const setCurrentPageMock = jest.fn();
    render(
      <Pagination
        currentPage={2}
        setCurrentPage={setCurrentPageMock}
        count={5}
      />
    );
    const secondPage = screen.getByText("2");
    await user.click(secondPage);

    expect(setCurrentPageMock).toHaveBeenCalledWith(2);
    const next = screen.getByRole("button", { name: /next/i });
    await user.click(next);
    expect(setCurrentPageMock).toHaveBeenCalledWith(3);
    const previous = screen.getByRole("button", { name: /previous/i });
    await user.click(previous);
    expect(setCurrentPageMock).toHaveBeenCalledWith(2);
    const dotsBtn = screen.queryByRole("button", { name: "..." });
    expect(dotsBtn).not.toBeInTheDocument();
  });

  test("renders dots button when current page is more than number of pages - 3 and shows all pages after clicking it", async () => {
    const setCurrentPageMock = jest.fn();
    render(
      <Pagination
        currentPage={4}
        setCurrentPage={setCurrentPageMock}
        count={10}
      />
    );
    const dotsBtn = screen.getByRole("button", { name: "..." });
    expect(dotsBtn).toBeInTheDocument();
    const sixthPage = screen.queryByText("6");
    expect(sixthPage).not.toBeInTheDocument();
    await user.click(dotsBtn);
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});
