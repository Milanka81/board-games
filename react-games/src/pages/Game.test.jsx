import { render, screen } from "../test-utils/testing-library-utils";
import Game from "./Game";
import { useGetGame } from "../hooks/game";
import { fakeGame } from "../testData";
import userEvent from "@testing-library/user-event";
import { postFavourite, postLike } from "../service";

jest.mock("../hooks/game", () => ({
  useGetGame: jest.fn(),
}));
jest.mock("../service", () => ({
  getGameLike: jest.fn(),
  getGameFavourite: jest.fn(),
  postLike: jest.fn(),
  postFavourite: jest.fn(),
}));
jest.mock("../components/Rating", () => {
  return () => {
    return <p>Game rating</p>;
  };
});
jest.mock("../components/Comment", () => {
  return () => {
    return <p>Game comments</p>;
  };
});
describe("renders game component", () => {
  const user = userEvent.setup();
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
  test("displays game details, back button, like button, add-to-favourites button, game rating and game comments", async () => {
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

    const year = await screen.findByText("1935");
    expect(year).toBeInTheDocument();
    const numberOfPlayers = await screen.findByText("2 - 8");
    expect(numberOfPlayers).toBeInTheDocument();

    const playingTime = await screen.findByText("90");
    expect(playingTime).toBeInTheDocument();

    const designers = await screen.findByText("Charles Darrow, Lizzie Magie");
    expect(designers).toBeInTheDocument();

    const artist = await screen.findByText("Edison Girard");
    expect(artist).toBeInTheDocument();

    const category = await screen.findByText("Family");
    expect(category).toBeInTheDocument();

    const likeBtn = await screen.findByRole("button", { name: /like/i });
    expect(likeBtn).toBeInTheDocument();
    const addToFavouritesBtn = await screen.findByRole("button", {
      name: /addtofavourites/i,
    });
    expect(addToFavouritesBtn).toBeInTheDocument();

    const ratingComponent = await screen.findByText("Game rating");
    const commentComponent = await screen.findByText("Game comments");
    expect(ratingComponent).toBeInTheDocument();
    expect(commentComponent).toBeInTheDocument();
  });
  test("calls functions on buttons click, buttons change name", async () => {
    useGetGame.mockReturnValue({
      data: fakeGame,
      isLoading: false,
      isSuccess: true,
      refetch: jest.fn(),
    });
    postLike.mockResolvedValue({});
    postFavourite.mockResolvedValue({});
    render(<Game />);
    const likeBtn = await screen.findByRole("button", { name: /like/i });
    await user.click(likeBtn);
    expect(postLike).toHaveBeenCalledTimes(1);
    const liked = await screen.findByText(/liked/i);
    expect(liked).toBeInTheDocument();
    const addToFavouritesBtn = await screen.findByRole("button", {
      name: /addtofavourites/i,
    });
    await user.click(addToFavouritesBtn);
    const favourited = await screen.findByText(/favourited/i);
    expect(favourited).toBeInTheDocument();
    expect(postFavourite).toHaveBeenCalledTimes(1);
  });
});
