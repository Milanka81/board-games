import { addGame } from "../service";
import { screen, render, waitFor } from "../test-utils/testing-library-utils";
import AddGame from "./AddGame";
import userEvent from "@testing-library/user-event";

jest.mock("../service", () => ({
  addGame: jest.fn(),
}));

describe("renders add game component", () => {
  const user = userEvent.setup();
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
  test("renders game input fields and buttons", async () => {
    render(<AddGame />);

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
    await user.click(saveBtn);
    expect(addGame).toHaveBeenCalledTimes(0);
  });
  test("shows error massages", async () => {
    // addGame.mockReturnValue({});
    render(<AddGame />);
    const saveBtn = screen.getByRole("button", { name: /save/i });
    const minPlayers = screen.getByPlaceholderText(/minplayers/i);
    const maxPlayers = screen.getByPlaceholderText(/maxplayers/i);
    await user.click(saveBtn);
    await waitFor(async () => {
      const errorImg = await screen.findByText(/imagerequired/i);
      expect(errorImg).toBeInTheDocument();
    });
    await waitFor(async () => {
      const errorName = await screen.findByText(/namerequired/i);
      expect(errorName).toBeInTheDocument();
    });
    await waitFor(async () => {
      const errorMinPlayers = await screen.findByText(
        /minnumberplayersrequired/i
      );
      expect(errorMinPlayers).toBeInTheDocument();
    });
    await waitFor(async () => {
      const errorMaxPlayers = await screen.findByText(
        /maxnumberplayersrequired/i
      );
      expect(errorMaxPlayers).toBeInTheDocument();
    });

    await user.type(minPlayers, "4");
    await user.type(maxPlayers, "3");
    await waitFor(async () => {
      const errorMaxLessThenMin = await screen.findByText(/maxgraterthanmin/i);
      expect(errorMaxLessThenMin).toBeInTheDocument();
    });
    await waitFor(async () => {
      const errorYear = await screen.findByText(/yearrequired/i);
      expect(errorYear).toBeInTheDocument();
    });
    await waitFor(async () => {
      const errorLength = await screen.findByText(/gamelengthrequired/i);
      expect(errorLength).toBeInTheDocument();
    });

    expect(addGame).not.toHaveBeenCalled();
  });
  test("submits game details on button click", async () => {
    window.URL.createObjectURL = jest.fn();
    const setOpenModal = jest.fn();

    render(<AddGame setOpenModal={setOpenModal} />);

    const cancelBtn = screen.getByRole("button", {
      name: /cancel/i,
    });
    const saveBtn = screen.getByRole("button", {
      name: /save/i,
    });
    await user.click(cancelBtn);
    expect(setOpenModal).toHaveBeenCalledTimes(1);
    const image = screen.getByLabelText(/uploadimage/i);
    expect(image).toBeInTheDocument();
    const file = new File(["file contents"], "test.png", { type: "image/png" });

    await user.upload(image, file);

    const nameInput = screen.getByPlaceholderText(gamePlaceholders[0]);
    const minPlayersInput = screen.getByPlaceholderText(gamePlaceholders[1]);
    const maxPlayersInput = screen.getByPlaceholderText(gamePlaceholders[2]);
    const yearInput = screen.getByPlaceholderText(gamePlaceholders[3]);
    const playingTimeInput = screen.getByPlaceholderText(gamePlaceholders[4]);
    await user.type(nameInput, "Monopoly");
    await user.type(minPlayersInput, "2");
    await user.type(maxPlayersInput, "8");
    await user.type(yearInput, "1935");
    await user.type(playingTimeInput, "90");
    await user.click(saveBtn);
    expect(addGame).toHaveBeenCalledTimes(1);
    expect(addGame).toHaveBeenCalledWith({
      artist: "",
      category: "",
      designer: "",
      gameLength: 90,
      img: file,
      maxPlayers: "8",
      minPlayers: "2",
      name: "Monopoly",
      year: "1935",
    });
  });
});
