import { screen, render, waitFor } from "../test-utils/testing-library-utils";
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
    const gameName = await screen.findByDisplayValue("Monopoly");
    await user.clear(gameName);
    const saveBtn = screen.getByRole("button", { name: /save/i });
    await user.click(saveBtn);
    await waitFor(async () => {
      const errorName = await screen.findByText(/namerequired/i);
      expect(errorName).toBeInTheDocument();
    });
    expect(editGame).not.toHaveBeenCalled();
    await user.type(gameName, "Monopoly");
    await user.click(saveBtn);
    expect(editGame).toHaveBeenCalled();
  });
  test("uploads an image", async () => {
    window.URL.createObjectURL = jest.fn();
    render(
      <EditGame
        game={fakeGame}
        isSuccess={true}
        refreshGame={() => {}}
        setIsEdit={() => {}}
      />
    );
    const image = await screen.findByLabelText(/editimage/i);
    expect(image).toBeInTheDocument();
    const dropBtn = screen.queryByRole("button", { name: /dropimage/i });
    expect(dropBtn).not.toBeInTheDocument();
    const file = new File(["file contents"], "test.png", { type: "image/png" });
    await user.upload(image, file);
    const dropImgBtn = await screen.findByRole("button", {
      name: /dropimage/i,
    });
    expect(dropImgBtn).toBeInTheDocument();
  });
});
