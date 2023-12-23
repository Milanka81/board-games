import { screen, render } from "../test-utils/testing-library-utils";
import EditGame from "./EditGame";
import userEvent from "@testing-library/user-event";
import { editGame } from "../service";
import { fakeGame } from "../testData";

jest.mock("../service", () => ({
  editGame: jest.fn(),
}));
describe("renders edit game component", () => {
  const user = userEvent.setup();
  test("game input fields and two buttons are visible", async () => {
    render(
      <EditGame
        game={fakeGame}
        isSuccess={true}
        refreshGame={() => {}}
        setIsEdit={() => {}}
      />
    );

    for (let key in fakeGame) {
      if (key === "game_id" || key === "added_date" || key === "img") continue;
      const value = fakeGame[key];
      const el = await screen.findByDisplayValue(value);
      expect(el).toBeInTheDocument();
    }

    const img = await screen.findByAltText("Monopoly");
    expect(img).toBeInTheDocument();
    const editImg = screen.getByLabelText(/editimage/);
    expect(editImg).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    const saveBtn = screen.getByRole("button", { name: /save/i });
    expect(cancelBtn).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
  });
  test("calls editGame function on save button click", async () => {
    editGame.mockResolvedValue({});
    render(
      <EditGame
        game={fakeGame}
        isSuccess={true}
        refreshGame={() => {}}
        setIsEdit={() => {}}
      />
    );
    const saveBtn = screen.getByRole("button", { name: /save/i });
    await user.click(saveBtn);
    expect(editGame).toHaveBeenCalledTimes(1);
  });
});
