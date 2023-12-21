import { screen, render } from "../test-utils/testing-library-utils";
import HomePage from "./HomePage";
import { useFilteredGames } from "../hooks/useFilteredGames";
import { useNewGames, useMostLikedGames } from "../hooks/games";
import { localStorageAdmin, localStorageUser } from "../testData";
jest.mock("../hooks/useFilteredGames", () => ({
  useFilteredGames: jest.fn(),
}));
jest.mock("../hooks/games", () => ({
  useNewGames: jest.fn(),
  useMostLikedGames: jest.fn(),
}));
jest.mock("./UserHomePage", () => {
  return () => {
    return "UserHomePage";
  };
});

describe("home page for role user", () => {
  localStorageUser();
  test("renders search bar, allGames, newGames, mostLikedGames and UserHomePage", async () => {
    useFilteredGames.mockResolvedValue({});
    useMostLikedGames.mockResolvedValue({});
    useNewGames.mockResolvedValue({});
    render(<HomePage />);
    const searchBar = screen.getByRole("textbox");
    expect(searchBar).toBeInTheDocument();
    const allGames = await screen.findByRole("heading", { name: /allgames/i });
    expect(allGames).toBeInTheDocument();
    const newGames = await screen.findByRole("heading", { name: /newgames/i });
    expect(newGames).toBeInTheDocument();
    const mostLikedGames = await screen.findByRole("heading", {
      name: /mostlikedgames/i,
    });
    expect(mostLikedGames).toBeInTheDocument();
    const userHomePage = await screen.findByText("UserHomePage");
    expect(userHomePage).toBeInTheDocument();
  });
  test("doesn't render navigation buttons games and users", () => {
    useFilteredGames.mockResolvedValue({});
    useMostLikedGames.mockResolvedValue({});
    useNewGames.mockResolvedValue({});
    render(<HomePage />);
    const usersBtn = screen.queryByRole("button", { name: /users/i });
    expect(usersBtn).not.toBeInTheDocument();
    const gamesBtn = screen.queryByRole("button", { name: /games/i });
    expect(gamesBtn).not.toBeInTheDocument();
  });
});
describe("home page for role admin", () => {
  localStorageAdmin();
  test("renders two navigation buttons, allGames, newGames and mostLikedGames", async () => {
    useFilteredGames.mockResolvedValue({});
    useMostLikedGames.mockResolvedValue({});
    useNewGames.mockResolvedValue({});
    render(<HomePage />);
    const usersBtn = screen.getByRole("button", { name: /users/i });
    expect(usersBtn).toBeInTheDocument();
    const gamesBtn = screen.getByRole("button", { name: /games/i });
    expect(gamesBtn).toBeInTheDocument();
    const allGames = await screen.findByRole("heading", { name: /allgames/i });
    expect(allGames).toBeInTheDocument();
    const newGames = await screen.findByRole("heading", { name: /newgames/i });
    expect(newGames).toBeInTheDocument();
    const mostLikedGames = await screen.findByRole("heading", {
      name: /mostlikedgames/i,
    });
    expect(mostLikedGames).toBeInTheDocument();
  });
  test("doesn't render search bar and userHomePage", () => {
    useFilteredGames.mockResolvedValue({});
    useMostLikedGames.mockResolvedValue({});
    useNewGames.mockResolvedValue({});
    render(<HomePage />);
    const searchBar = screen.queryByRole("textbox");
    expect(searchBar).not.toBeInTheDocument();
    const userHomePage = screen.queryByText("UserHomePage");
    expect(userHomePage).not.toBeInTheDocument();
  });
});
