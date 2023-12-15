import { render, screen } from "../test-utils/testing-library-utils";
import Game from "./Game";
import { useGetGame } from "../hooks/game";
import { fakeGame } from "../testData";

jest.mock("../hooks/game", () => ({
  useGetGame: jest.fn(),
}));

jest.mock("../components/Rating", () => {
  return () => {
    return "Game rating";
  };
});
jest.mock("../components/Comment", () => {
  return () => {
    return "Game comments";
  };
});
describe("renders game component", () => {
  test("shows loading spinner while fetching game's data", () => {
    useGetGame.mockReturnValue({
      data: fakeGame,
      isLoading: true,
    });
    render(<Game />);

    const spinner = screen.getByText(/loading/i);
    expect(spinner).toBeInTheDocument();
    const heading = screen.queryByText(/Monopoly/i);
    expect(heading).not.toBeInTheDocument();
  });
  test("game page displays game name", async () => {
    useGetGame.mockReturnValue({
      data: fakeGame,
      isLoading: false,
      isSuccess: true,
      refetch: jest.fn(),
    });
    render(<Game />);

    const backBtn = await screen.findByRole("button", { name: /back/i });
    expect(backBtn).toBeInTheDocument();

    const heading = await screen.findByText(/Monopoly/i);
    expect(heading).toBeInTheDocument();
  });
});
