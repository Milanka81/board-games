import { screen, render, waitFor } from "../test-utils/testing-library-utils";
import ListOfUsers from "./ListOfUsers";
import { fakeUsers, localStorageAdmin } from "../testData";
import { useFilteredUsers } from "../hooks/users";
import userEvent from "@testing-library/user-event";
jest.mock("../components/User", () => {
  return () => {
    return "User Component";
  };
});
jest.mock("../components/Pagination", () => {
  return () => {
    return "Pagination";
  };
});
jest.mock("../hooks/users", () => ({
  useFilteredUsers: jest.fn(),
}));
describe("renders list of users", () => {
  const user = userEvent.setup();
  localStorageAdmin();
  test("renders games button, search bar, table of users and pagination", () => {
    useFilteredUsers.mockResolvedValue({
      filteredUsers: fakeUsers,
      isLoading: false,
      isSuccess: true,
      refetch: jest.fn(),
      pageCount: 1,
    });
    render(<ListOfUsers />);

    const gamesBtn = screen.getByRole("button", { name: /games/i });
    expect(gamesBtn).toBeInTheDocument();
    const searchUser = screen.getByRole("textbox");
    expect(searchUser).toBeInTheDocument();

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    const firstName = screen.getByRole("columnheader", {
      name: /firstname/i,
    });
    expect(firstName).toBeInTheDocument();
    const lastName = screen.getByRole("columnheader", {
      name: /lastname/i,
    });
    expect(lastName).toBeInTheDocument();
    const username = screen.getByRole("columnheader", {
      name: /username/i,
    });
    expect(username).toBeInTheDocument();
    const email = screen.getByRole("columnheader", {
      name: /email/i,
    });
    expect(email).toBeInTheDocument();
    const role = screen.getByRole("columnheader", {
      name: /role/i,
    });
    expect(role).toBeInTheDocument();
    const pagination = screen.getByText("Pagination");
    expect(pagination).toBeInTheDocument();
  });
  test("calls useFilterUsers function on first render and when user types in the search bar", async () => {
    useFilteredUsers.mockResolvedValue({
      filteredUsers: fakeUsers,
      isLoading: false,
      isSuccess: true,
      refetch: jest.fn(),
      pageCount: 1,
    });
    render(<ListOfUsers />);
    expect(useFilteredUsers).toHaveBeenCalledTimes(1);
    expect(useFilteredUsers).toHaveBeenCalledWith(1, 5, "", "user_id");
    const searchUser = screen.getByRole("textbox");
    await user.type(searchUser, "mary");

    await waitFor(() =>
      expect(useFilteredUsers).toHaveBeenCalledWith(1, 5, "mary", "user_id")
    );
  });
});
