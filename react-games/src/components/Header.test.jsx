import userEvent from "@testing-library/user-event";
import { screen, render, waitFor } from "../test-utils/testing-library-utils";
import Header from "./Header";
import "@testing-library/jest-dom";
import { localStorageUser } from "../testData";

describe("when user is not logged in", () => {
  test("app title is visible, greeting is not", async () => {
    render(<Header />);

    const appTitle = screen.getByText(/apptitle/);
    expect(appTitle).toBeInTheDocument();
    const greeting = screen.queryByText(/welcome/i);
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    const username = screen.queryByText(`${loggedUser?.username}`);
    expect(greeting).not.toBeInTheDocument();
    expect(username).not.toBeInTheDocument();
  });

  test("list buttons are not visible, language button is", () => {
    render(<Header />);
    const languageBtn = screen.getByRole("button", { name: "Language" });
    expect(languageBtn).toBeInTheDocument();

    const listBtns = screen.queryAllByRole("listitem");
    const btns = screen.queryAllByRole("button");

    expect(btns).toHaveLength(1);
    expect(listBtns).toHaveLength(0);
  });
});

describe("when user is logged in", () => {
  const user = userEvent.setup();
  localStorageUser();

  test("app title is not visible, greeting and username are visible instead", async () => {
    render(<Header />);

    const appTitle = screen.queryByText(/apptitle/);
    expect(appTitle).not.toBeInTheDocument();

    const greeting = screen.getByText(/welcome/i);
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    const username = await screen.findByText(`${loggedUser.username}`);
    expect(greeting).toBeInTheDocument();
    expect(username).toBeInTheDocument();
  });

  test("home, profile, logout and language buttons are visible", async () => {
    render(<Header />);
    const languageBtn = screen.getByRole("button", { name: "Language" });
    expect(languageBtn).toBeInTheDocument();

    const homeBtn = screen.getByRole("button", { name: /home/ });
    const profileBtn = screen.getByRole("button", { name: /profile/ });
    const logoutBtn = screen.getByRole("button", { name: /logout/ });
    const listBtns = screen.getAllByRole("listitem");
    const btns = screen.getAllByRole("button");
    expect(homeBtn).toBeInTheDocument();
    expect(profileBtn).toBeInTheDocument();
    expect(logoutBtn).toBeInTheDocument();
    expect(btns).toHaveLength(4);
    expect(listBtns).toHaveLength(3);
  });
  test("profile button navigation", async () => {
    render(<Header />);
    const profileBtn = screen.getByRole("button", { name: /profile/ });
    await user.click(profileBtn);
    await waitFor(() => expect(window.location.pathname).toBe("/profile"));
  });
  test("home button navigation", async () => {
    render(<Header />);
    const homeBtn = screen.getByRole("button", { name: /home/ });
    await user.click(homeBtn);
    await waitFor(() => expect(window.location.pathname).toBe("/"));
  });
  test("logout button", async () => {
    render(<Header />);

    const logoutBtn = screen.getByRole("button", { name: /logout/ });

    await user.click(logoutBtn);
    await waitFor(() => expect(window.location.pathname).toBe("/login"));
  });
});
