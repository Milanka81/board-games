import { screen, render } from "../test-utils/testing-library-utils";
import { fakeGames } from "../testData";
import Games from "./Games";
import userEvent from "@testing-library/user-event";

describe("renders games", () => {
  const user = userEvent.setup();
  test("renders two games", async () => {
    render(<Games header="All Games" games={fakeGames} id="allGames" />);

    const header = await screen.findByRole("heading", { name: /all games/i });
    expect(header).toBeInTheDocument();
    const headings = await screen.findAllByRole("heading");
    expect(headings).toHaveLength(3);
    const images = await screen.findAllByRole("img");
    expect(images).toHaveLength(2);
    const year = await screen.findAllByText(/year/i);
    expect(year).toHaveLength(2);
    const players = await screen.findAllByText(/numberofplayers/i);
    expect(players).toHaveLength(2);
    const time = await screen.findAllByText(/playingtime/i);
    expect(time).toHaveLength(2);
  });
  test("redirects to the game page when clicking game image", async () => {
    render(<Games header="All Games" games={fakeGames} id="allGames" />);
    const image = await screen.findByAltText(/monopoly/i);
    expect(image).toBeInTheDocument();
    await user.click(image);
    expect(window.location.pathname).toBe("/game/1");
  });
});
