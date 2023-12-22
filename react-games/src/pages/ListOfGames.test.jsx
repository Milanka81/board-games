import { screen, render, waitFor } from "../test-utils/testing-library-utils";
import ListOfGames from "./ListOfGames";
import userEvent from "@testing-library/user-event";
import { useFilteredGames } from "../hooks/useFilteredGames";
import { fakeGames, localStorageAdmin } from "../testData";
jest.mock("../hooks/useFilteredGames", () => ({
  useFilteredGames: jest.fn(),
}));
jest.mock("../components/Pagination", () => {
  return () => {
    return "Pagination";
  };
});
const columns = [
  "image",
  "▲ name",
  "▲ dateadded",
  "▲ minplayers",
  "maxplayers",
  "▲ year",
  "▲ playingtime",
  "artist",
  "designer",
  "category",
];
describe("renders list of games", () => {
  const user = userEvent.setup();
  localStorageAdmin();
  test("renders users button, search bar, table of games and pagination", () => {
    useFilteredGames.mockResolvedValue({});
    render(<ListOfGames />);
    const usersBtn = screen.getByRole("button", {
      name: /users/i,
    });
    expect(usersBtn).toBeInTheDocument();
    const serchBar = screen.getByRole("textbox");
    expect(serchBar).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    const addBtn = screen.getByRole("button", {
      name: /addnewgame/i,
    });
    expect(addBtn).toBeInTheDocument();
    for (let column in columns) {
      const value = columns[column];
      const el = screen.getByText(value);
      expect(el).toBeInTheDocument();
    }
    const pagination = screen.getByText("Pagination");
    expect(pagination).toBeInTheDocument();
  });
  test("calls useFilterGames function on first render and when user types in the search bar", async () => {
    useFilteredGames.mockResolvedValue({
      filteredGames: fakeGames,
      isLoading: false,
      isSuccess: true,
      refetch: jest.fn(),
      pageCount: 1,
    });
    render(<ListOfGames />);
    expect(useFilteredGames).toHaveBeenCalledTimes(1);
    expect(useFilteredGames).toHaveBeenCalledWith(1, 5, "", "game_id", true);
    const searchBar = screen.getByRole("textbox");
    await user.type(searchBar, "monopoly");

    await waitFor(() =>
      expect(useFilteredGames).toHaveBeenCalledWith(
        1,
        5,
        "monopoly",
        "game_id",
        true
      )
    );
  });
  test("opens add game component when addNewGame button is clicked and closes on cancel button click", async () => {
    useFilteredGames.mockResolvedValue({
      filteredGames: fakeGames,
      isLoading: false,
      isSuccess: true,
      refetch: jest.fn(),
      pageCount: 1,
    });
    render(<ListOfGames />);
    const addBtn = screen.getByRole("button", {
      name: /addnewgame/i,
    });
    await user.click(addBtn);
    const addGameTitle = screen.getByRole("heading", {
      name: /addnewgame/i,
    });
    expect(addGameTitle).toBeInTheDocument();
    const saveBtn = screen.getByRole("button", {
      name: /save/i,
    });
    const cancelBtn = screen.getByRole("button", {
      name: /cancel/i,
    });
    expect(saveBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
    await user.click(cancelBtn);
    const addNewGameTitle = screen.queryByRole("heading", {
      name: /addnewgame/i,
    });
    expect(addNewGameTitle).not.toBeInTheDocument();
  });
});
