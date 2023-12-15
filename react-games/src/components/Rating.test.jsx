import { screen, render, waitFor } from "../test-utils/testing-library-utils";
import { localStorageAdmin, localStorageUser } from "../testData";
import Rating from "./Rating";
import userEvent from "@testing-library/user-event";
import { getRating, getAvgRating, postRating } from "../service";

jest.mock("../service", () => ({
  getRating: jest.fn(),
  getAvgRating: jest.fn(),
  postRating: jest.fn(),
}));

describe("renders rating for admin", () => {
  localStorageAdmin();
  test("renders average game rating for admin", async () => {
    getRating.mockResolvedValue({
      data: [
        { user_id: 2, user_rate: 5 },
        { user_id: 4, user_rate: 3 },
      ],
    });
    getAvgRating.mockResolvedValue({ data: [{ avg: "4.0000" }] });

    const { container } = render(<Rating id={1} />);

    const radio = screen.getAllByRole("radio");
    expect(radio).toHaveLength(5);
    const svgGrey = container.querySelectorAll('[ color="#aaa"]');
    expect(svgGrey).toHaveLength(5);
    const avgRating = screen.getByText(/avgrating/);
    expect(avgRating).toBeInTheDocument();
    const maxRating = screen.getByText(/5/);
    expect(maxRating).toBeInTheDocument();
    const currentRating = await screen.findByText("4.00");
    expect(currentRating).toBeInTheDocument();
    const svgYellow = container.querySelectorAll('[ color="#ffc107"]');
    expect(svgYellow).toHaveLength(4);
  });
});

describe("renders rating for user", () => {
  localStorageUser();
  const user = userEvent.setup();
  test("changes game rating on click", async () => {
    getRating.mockResolvedValue({
      data: [
        { user_id: 2, user_rate: 5 },
        { user_id: 4, user_rate: 1 },
      ],
    });
    getAvgRating.mockResolvedValue({ data: [{ avg: "3.0000" }] });
    postRating.mockResolvedValue();

    const { container } = render(<Rating id={1} />);
    const radio = screen.getByDisplayValue(/5/i);
    const radio2 = screen.getByDisplayValue(/2/i);
    expect(radio).toBeInTheDocument();
    const star = screen.getAllByTestId("star");
    const svgGrey = container.querySelectorAll('[ color="#aaa"]');
    expect(svgGrey).toHaveLength(5);
    expect(star).toHaveLength(5);
    await user.click(radio);
    expect(postRating).toHaveBeenCalledTimes(1);
    expect(postRating).toHaveBeenCalledWith(1, 5);
    await waitFor(() => {
      const svgYellow = container.querySelectorAll('[ color="#ffc107"]');
      expect(svgYellow).toHaveLength(5);
    });
    await user.click(radio2);
    expect(postRating).toHaveBeenCalledWith(1, 2);
    await waitFor(() => {
      const svgYellow = container.querySelectorAll('[ color="#ffc107"]');
      expect(svgYellow).toHaveLength(2);
    });
  });
});
