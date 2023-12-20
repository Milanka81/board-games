import {
  getPreferences,
  getSubscription,
  getGameCategories,
  editSubscription,
  addPreferences,
  editPreferences,
} from "../service";
import { screen, render } from "../test-utils/testing-library-utils";
import { localStorageUser } from "../testData";
import Preferences from "./Preferences";
import userEvent from "@testing-library/user-event";

jest.mock("../service", () => ({
  getPreferences: jest.fn(),
  getSubscription: jest.fn(),
  addPreferences: jest.fn(),
  getGameCategories: jest.fn(),
  editPreferences: jest.fn(),
  editSubscription: jest.fn(),
}));

// jest.mock("multiselect-react-dropdown", () => {
//   return () => {
//     return "Multiselect";
//   };
// });

describe("renders preferences component", () => {
  const user = userEvent.setup();
  localStorageUser();
  test("displays add preferences component fields", async () => {
    // getPreferences.mockResolvedValue({ data: [] });
    getSubscription.mockResolvedValue({ data: [] });
    getGameCategories.mockResolvedValue({
      data: [
        { category_id: 1, category_name: "Strategy" },
        { category_id: 2, category_name: "Mistery" },
      ],
    });
    render(
      <Preferences
        title="addgamepreferences"
        componentState="isAdding"
        className="form"
        fieldClassName="form__inputField-edit"
        handleCancel={() => {}}
        handleEdit={() => {}}
      />
    );
    const title = screen.getByRole("heading");
    expect(title).toBeInTheDocument();
    const numPlayers = screen.getByRole("spinbutton", {
      name: /numberofplayers/i,
    });
    expect(numPlayers).toBeInTheDocument();
    const playingTime = screen.getByText(/playingtime/i);
    expect(playingTime).toBeInTheDocument();
    const gameLengthFrom = screen.getByRole("spinbutton", {
      name: /playingtime/i,
    });
    expect(gameLengthFrom).toBeInTheDocument();
    const gameLengthTo = screen.getByRole("spinbutton", {
      name: /-/,
    });
    expect(gameLengthTo).toBeInTheDocument();
    const artist = screen.getByRole("textbox", {
      name: /artist/i,
    });
    expect(artist).toBeInTheDocument();
    const designer = screen.getByRole("textbox", {
      name: /designer/i,
    });
    expect(designer).toBeInTheDocument();
    const selectCategory = screen.getByPlaceholderText(/select/i);
    expect(selectCategory).toBeInTheDocument();
    const addCategory = screen.getByRole("textbox", {
      name: /addcategory/i,
    });
    expect(addCategory).toBeInTheDocument();
    const saveBtn = screen.getByRole("button", {
      name: /save/i,
    });

    expect(saveBtn).toBeInTheDocument();
    const cancelBtn = screen.queryByRole("button", {
      name: /cancel/i,
    });
    expect(cancelBtn).not.toBeInTheDocument();
    await user.type(addCategory, "Strategy");
    const categoryInput = screen.getByText("Strategy");
    expect(categoryInput).toBeInTheDocument();
    await user.click(saveBtn);
    expect(addPreferences).toHaveBeenCalledTimes(1);
  });
  test("renders user's preferences with subscribe checkbox, input fields are disabled", async () => {
    getPreferences.mockResolvedValue({
      data: [
        {
          artist: null,
          category: "Party",
          designer: null,
          game_length_from: 60,
          game_length_to: 120,
          number_players: 7,
          subscribed: 0,
          user_id: 2,
        },
      ],
    });
    getSubscription.mockResolvedValue({ data: [] });
    editSubscription.mockResolvedValue({});
    getGameCategories.mockResolvedValue({
      data: [
        { category_id: 1, category_name: "Strategy" },
        { category_id: 2, category_name: "Mistery" },
      ],
    });
    render(
      <Preferences
        componentState="isViewing"
        fieldClassName="form__inputField-edit"
        handleEdit={() => {}}
      />
    );
    const numPlayers = await screen.findByDisplayValue(7);
    expect(numPlayers).toBeInTheDocument();
    expect(numPlayers).toBeDisabled();
    const gameLengthFrom = await screen.findByDisplayValue(60);
    expect(gameLengthFrom).toBeDisabled();
    const gameLengthTo = await screen.findByDisplayValue(120);
    expect(gameLengthTo).toBeDisabled();
    const category = await screen.findByDisplayValue("Party");
    expect(category).toBeDisabled();
    const artist = await screen.findByLabelText(/artist/);
    expect(artist).toBeDisabled();
    const designer = await screen.findByLabelText(/designer/);
    expect(designer).toBeDisabled();
    const unsubscribed = await screen.findByText(/unsubscribed/i);
    expect(unsubscribed).toBeInTheDocument();
    const checkbox = screen.getByRole("checkbox", {
      name: /unsubscribed/i,
    });
    expect(checkbox).toBeInTheDocument();
    await user.click(checkbox);
    expect(editSubscription).toHaveBeenCalledTimes(1);
    const subscribed = await screen.findByText(/subscribed/i);
    expect(subscribed).toBeInTheDocument();
    const cancelBtn = screen.queryByRole("button", { name: /cancel/i });
    expect(cancelBtn).not.toBeInTheDocument();
    const editBtn = screen.getByRole("button", { name: /edit/i });
    expect(editBtn).toBeInTheDocument();
  });
  test("renders edit preferences component, two buttons and select manu", async () => {
    getPreferences.mockResolvedValue({
      data: [
        {
          artist: null,
          category: "Party",
          designer: null,
          game_length_from: 60,
          game_length_to: 120,
          number_players: 7,
          subscribed: 0,
          user_id: 2,
        },
      ],
    });
    getSubscription.mockResolvedValue({ data: [] });
    editSubscription.mockResolvedValue({});
    getGameCategories.mockResolvedValue({
      data: [
        { category_id: 1, category_name: "Strategy" },
        { category_id: 2, category_name: "Mistery" },
      ],
    });
    render(
      <Preferences
        componentState="isEditing"
        fieldClassName="form__inputField-edit"
        handleEdit={editPreferences}
      />
    );
    const numPlayers = await screen.findByDisplayValue(7);
    expect(numPlayers).toBeInTheDocument();
    await user.clear(numPlayers);
    await user.type(numPlayers, "2");
    const gameLengthFrom = await screen.findByDisplayValue(60);
    expect(gameLengthFrom).toBeInTheDocument();
    const gameLengthTo = await screen.findByDisplayValue(120);
    await user.clear(gameLengthTo);
    const category = await screen.findByDisplayValue("Party");
    expect(category).toBeInTheDocument();
    const artist = await screen.findByLabelText(/artist/);
    await user.type(artist, "Michael Williams");
    const designer = await screen.findByLabelText(/designer/);
    expect(designer).toBeInTheDocument();
    const select = screen.getByPlaceholderText(/select/i);
    expect(select).toBeInTheDocument();
    const cat1 = screen.getByText("Strategy");
    expect(cat1).toBeInTheDocument();
    await user.click(cat1);
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    expect(cancelBtn).toBeInTheDocument();
    const saveBtn = screen.getByRole("button", { name: /save/i });
    expect(saveBtn).toBeInTheDocument();
    await user.click(saveBtn);
    expect(editPreferences).toHaveBeenCalledTimes(1);
    expect(editPreferences).toHaveBeenCalledWith({
      values: {
        artist: "Michael Williams",
        category: "Party",
        designer: "",
        gameLengthFrom: 60,
        gameLengthTo: "",
        numberOfPlayers: 2,
      },
      user_id: 2,
      selectedCategories: ["Strategy"],
    });
  });
});
