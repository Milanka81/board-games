import { screen, render } from "../test-utils/testing-library-utils";
import AddGame from "./AddGame";

describe("renders add game component", () => {
  test("renders game input fields and buttons", async () => {
    render(<AddGame />);
    // screen.logTestingPlaygroundURL();
    const gamePlaceholders = [
      "name",
      "minplayers",
      "maxplayers",
      "year",
      "playingtime",
      "artist",
      "designer",
      "category",
    ];
    const heading = screen.getByRole("heading", {
      name: /addnewgame/i,
    });
    expect(heading).toBeInTheDocument();
    const uploadImg = screen.getByText(/uploadimage/i);
    expect(uploadImg).toBeInTheDocument();
    const fileUpload = screen.getByLabelText(/uploadimage/i);
    expect(fileUpload).toBeInTheDocument();

    for (let key in gamePlaceholders) {
      const value = gamePlaceholders[key];
      const el = screen.getByPlaceholderText(value);
      expect(el).toBeInTheDocument();
    }
    const cancelBtn = screen.getByRole("button", {
      name: /cancel/i,
    });
    const saveBtn = screen.getByRole("button", {
      name: /save/i,
    });
    expect(cancelBtn).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
  });
  test("click", () => {});
});
