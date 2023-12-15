import { screen, render } from "../test-utils/testing-library-utils";
import { fakeUser } from "../testData";
import EditAccount from "./EditAccount";
import userEvent from "@testing-library/user-event";
import { editUser } from "../service";

jest.mock("../service", () => ({
  editUser: jest.fn(),
}));

describe("edit account", () => {
  const user = userEvent.setup();
  test("renders five input and two button elements", async () => {
    render(
      <EditAccount
        user={fakeUser}
        handleCancel={() => {}}
        fetchUser={() => {}}
      />
    );
    const inputs = await screen.findAllByRole("textbox");
    expect(inputs).toHaveLength(5);
    const btns = await screen.findAllByRole("button");
    expect(btns).toHaveLength(2);
    const username = await screen.findByPlaceholderText("username");
    const role = await screen.findByPlaceholderText("role");
    expect(username).toBeInTheDocument();
    expect(username).toBeDisabled();
    expect(role).toBeInTheDocument();
    expect(role).toBeDisabled();
  });
  test("changes input value when clicking save button", async () => {
    render(
      <EditAccount
        user={fakeUser}
        handleCancel={() => {}}
        fetchUser={() => {}}
      />
    );
    const saveBtn = await screen.findByRole("button", { name: /save/i });
    expect(saveBtn).toBeInTheDocument();
    const firstname = await screen.findByPlaceholderText("firstname");
    await user.clear(firstname);
    await user.type(firstname, "Peter");
    await user.click(saveBtn);
    expect(firstname).toHaveValue("Peter");
    expect(editUser).toHaveBeenCalledTimes(1);
  });
  test("doesn't changes input value when clicking cancel button", async () => {
    render(
      <EditAccount
        user={fakeUser}
        handleCancel={() => {}}
        fetchUser={() => {}}
      />
    );
    const cancelBtn = await screen.findByRole("button", { name: /cancel/i });
    expect(cancelBtn).toBeInTheDocument();
    const firstname = await screen.findByPlaceholderText("firstname");
    await user.clear(firstname);
    await user.type(firstname, "Peter");
    await user.click(cancelBtn);
    expect(editUser).toHaveBeenCalledTimes(0);
  });
});
