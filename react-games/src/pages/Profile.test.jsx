import { render, screen } from "../test-utils/testing-library-utils";
import Profile from "./Profile";
import userEvent from "@testing-library/user-event";
import { localStorageAdmin, localStorageUser } from "../testData";
import { useGetLoggedUser } from "../hooks/loggedUser";
import { useGetUserComments } from "../hooks/comment";

jest.mock("../hooks/loggedUser", () => ({
  useGetLoggedUser: jest.fn(),
}));
jest.mock("../hooks/comment", () => ({
  useGetUserComments: jest.fn(),
}));
jest.mock("../components/Account", () => {
  return () => {
    return "Account Component";
  };
});
jest.mock("../components/EditAccount", () => {
  return () => {
    return "Edit Account Component";
  };
});
jest.mock("./Preferences", () => {
  return () => {
    return "Preferences Component";
  };
});
jest.mock("../components/Comment", () => {
  return () => {
    return "Comment Component";
  };
});
describe("profile page for role user", () => {
  const user = userEvent.setup();
  localStorageUser();
  test("renders two buttons, account component and comment component", () => {
    useGetLoggedUser.mockResolvedValue({});
    useGetUserComments.mockResolvedValue({});
    render(<Profile />);
    const accountBtn = screen.getByRole("button", {
      name: /account/i,
    });
    expect(accountBtn).toBeInTheDocument();
    const preferencesBtn = screen.getByRole("button", {
      name: /preferences/i,
    });
    expect(preferencesBtn).toBeInTheDocument();
    const title = screen.getByRole("heading", {
      name: /accountinfo/i,
    });
    expect(title).toBeInTheDocument();
    const comment = screen.getByText("Comment Component");
    expect(comment).toBeInTheDocument();
  });
  test("renders preferences component when click on button", async () => {
    useGetLoggedUser.mockResolvedValue({});
    useGetUserComments.mockResolvedValue({});
    render(<Profile />);
    const preferencesBtn = screen.getByRole("button", {
      name: /preferences/i,
    });
    await user.click(preferencesBtn);
    const title = screen.getByRole("heading", {
      name: /preferences/i,
    });
    const preferencesComponent = await screen.findByText(
      "Preferences Component"
    );
    expect(title).toBeInTheDocument();
    expect(preferencesComponent).toBeInTheDocument();
  });
});

describe("profile page for role admin", () => {
  localStorageAdmin();
  test("doesn't render navigation buttons", () => {
    useGetLoggedUser.mockResolvedValue({});
    useGetUserComments.mockResolvedValue({});
    render(<Profile />);
    const accountBtn = screen.queryByRole("button", {
      name: /account/i,
    });
    expect(accountBtn).not.toBeInTheDocument();
    const preferencesBtn = screen.queryByRole("button", {
      name: /preferences/i,
    });
    expect(preferencesBtn).not.toBeInTheDocument();
  });
});
