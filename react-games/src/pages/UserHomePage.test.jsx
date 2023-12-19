import { render, screen } from "../test-utils/testing-library-utils";
import UserHomePage from "./UserHomePage";
import { useRecommendedGames, useFavouriteGames } from "../hooks/games";
import { useIsPreferences } from "../hooks/preferences";
import { fakeGames } from "../testData";

jest.mock("../hooks/games", () => ({
  useRecommendedGames: jest.fn(),
  useFavouriteGames: jest.fn(),
}));
jest.mock("../hooks/preferences", () => ({
  useIsPreferences: jest.fn(),
}));

jest.mock("../components/Modal", () => {
  return () => {
    return "Preferences Component";
  };
});
describe("renders user hompage", () => {
  test("renders preferences component when user first landed home page", async () => {
    useRecommendedGames.mockReturnValue({
      data: [],
    });
    useFavouriteGames.mockReturnValue({
      data: [],
    });
    useIsPreferences.mockReturnValue({
      data: [],
    });
    render(<UserHomePage />);
    const preferencesComponent = screen.getByText("Preferences Component");
    expect(preferencesComponent).toBeInTheDocument();
    // screen.logTestingPlaygroundURL();
  });
  test("doesn't render preferences component when user add preferences nor games if there aren't any", async () => {
    useRecommendedGames.mockReturnValue({
      data: [],
    });
    useFavouriteGames.mockReturnValue({
      data: [],
    });
    useIsPreferences.mockReturnValue({
      data: [{ 1: 1 }],
    });
    render(<UserHomePage />);
    const preferencesComponent = screen.queryByText("Preferences Component");
    expect(preferencesComponent).not.toBeInTheDocument();
    const favouriteGames = screen.queryByRole("heading", {
      name: /favouritegames/i,
    });
    expect(favouriteGames).not.toBeInTheDocument();
    // screen.logTestingPlaygroundURL();
  });
  test("renders favourite and recommended games", async () => {
    useRecommendedGames.mockReturnValue({
      data: fakeGames,
    });
    useFavouriteGames.mockReturnValue({
      data: fakeGames,
    });
    useIsPreferences.mockReturnValue({
      data: [{ 1: 1 }],
    });
    render(<UserHomePage />);
    const preferencesComponent = screen.queryByText("Preferences Component");
    expect(preferencesComponent).not.toBeInTheDocument();

    const favouriteGames = screen.getByRole("heading", {
      name: /favouritegames/i,
    });
    const recommendedGames = screen.getByRole("heading", {
      name: /recommendedgames/i,
    });
    expect(favouriteGames).toBeInTheDocument();
    expect(recommendedGames).toBeInTheDocument();
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(4);
  });
});
