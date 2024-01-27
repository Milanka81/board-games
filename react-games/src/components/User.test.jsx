import { screen, render } from "../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import User from "./User";
import { fakeUser } from "../testData";
import { editUser } from "../service";

jest.mock("../service", () => ({
  editUser: jest.fn(),
}));

describe("renders user component", () => {
  const user = userEvent.setup();
  test("renders details about user", async () => {
    render(
      <table>
        <tbody>
          <User i={0} user={fakeUser} isViewing={true} />
        </tbody>
      </table>
    );
    const userRow = await screen.findByRole("row");
    expect(userRow).toBeInTheDocument(); // screen.debug();
    const cells = await screen.findAllByRole("cell");
    expect(cells).toHaveLength(7);
    const inputs = await screen.findAllByRole("textbox");
    expect(inputs).toHaveLength(5);
    const btns = await screen.findAllByRole("button");
    expect(btns).toHaveLength(2);

    const num = await screen.findByRole("cell", { name: "1" });
    expect(num).toBeInTheDocument();
    const firstName = await screen.findByDisplayValue("John");
    const lastName = await screen.findByDisplayValue("Smith");
    const username = await screen.findByDisplayValue("john123");
    const email = await screen.findByDisplayValue("john123@gmail.com");
    const role = await screen.findByDisplayValue("user");
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(role).toBeInTheDocument();
  });
  test("renders edit and delete buttons when isViewing is true", async () => {
    const handleEdit = jest.fn();
    render(
      <table>
        <tbody>
          <User
            i={0}
            user={fakeUser}
            handleEdit={handleEdit}
            isViewing={true}
          />
        </tbody>
      </table>
    );
    const editBtn = await screen.findByRole("button", { name: /edit/i });
    expect(editBtn).toBeInTheDocument();
    const deleteBtn = await screen.findByRole("button", { name: /delete/i });
    expect(deleteBtn).toBeInTheDocument();
    await user.click(editBtn);
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });
  test("renders save and cancel buttons when isEditing is true", async () => {
    render(
      <table>
        <tbody>
          <User i={0} user={fakeUser} isEditing={true} isViewing={false} />
        </tbody>
      </table>
    );
    const firstName = await screen.findByDisplayValue("John");
    const lastName = await screen.findByDisplayValue("Smith");
    const username = await screen.findByDisplayValue("john123");
    const email = await screen.findByDisplayValue("john123@gmail.com");
    const role = await screen.findByDisplayValue("user");
    expect(firstName).toBeEnabled();
    expect(lastName).toBeEnabled();
    expect(username).toBeDisabled();
    expect(email).toBeDisabled();
    expect(role).toBeEnabled();
    const saveBtn = await screen.findByRole("button", { name: /save/i });
    expect(saveBtn).toBeInTheDocument();
    const cancelBtn = await screen.findByRole("button", { name: /cancel/i });
    expect(cancelBtn).toBeInTheDocument();
    await user.type(lastName, " Blake");
    await user.clear(role);
    await user.type(role, "admin");
    await user.click(saveBtn);
    expect(editUser).toHaveBeenCalledTimes(1);
    expect(editUser).toHaveBeenCalledWith(
      {
        firstName: "John",
        lastName: "Smith Blake",
        username: "john123",
        email: "john123@gmail.com",
        role: "admin",
      },
      1
    );
  });
});
